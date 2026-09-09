const { query, withTransaction } = require('../config/db');

// Get prescriptions for patient
async function getPrescriptions(req, res, next) {
  try {
    const { patientProfileId } = req.query;

    let sql = `
      SELECT p.id, p.prescription_id, p.patient_profile_id, p.patient_name,
             p.doctor_name, p.facility_name, p.diagnosis, p.prescription_date,
             p.notes, p.created_at,
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', pm.id,
                   'medicineName', pm.medicine_name,
                   'dosage', pm.dosage,
                   'frequency', pm.frequency,
                   'duration', pm.duration,
                   'instructions', pm.instructions
                 )
               ) FILTER (WHERE pm.id IS NOT NULL), '[]'
             ) AS medicines
      FROM prescriptions p
      LEFT JOIN prescription_medicines pm ON p.prescription_id = pm.prescription_id
    `;
    const params = [];

    if (patientProfileId) {
      params.push(patientProfileId);
      sql += ` WHERE p.patient_profile_id = $1`;
    }

    sql += ` GROUP BY p.id ORDER BY p.prescription_date DESC, p.created_at DESC;`;

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// Get single prescription
async function getPrescriptionById(req, res, next) {
  try {
    const { id } = req.params;

    const sql = `
      SELECT p.id, p.prescription_id, p.patient_profile_id, p.patient_name,
             p.doctor_name, p.facility_name, p.diagnosis, p.prescription_date,
             p.notes, p.created_at,
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', pm.id,
                   'medicineName', pm.medicine_name,
                   'dosage', pm.dosage,
                   'frequency', pm.frequency,
                   'duration', pm.duration,
                   'instructions', pm.instructions
                 )
               ) FILTER (WHERE pm.id IS NOT NULL), '[]'
             ) AS medicines
      FROM prescriptions p
      LEFT JOIN prescription_medicines pm ON p.prescription_id = pm.prescription_id
      WHERE p.prescription_id = $1 OR p.id::text = $1
      GROUP BY p.id;
    `;

    const result = await query(sql, [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Prescription not found.' });
    }

    res.json(result.rows[0]);
  } catch (err) {
    next(err);
  }
}

// Create Medicine Order (Transactional, without modifying original prescription)
async function createMedicineOrder(req, res, next) {
  try {
    const {
      patientProfileId, prescriptionId, storeId,
      deliveryAddress, items
    } = req.body;

    if (!patientProfileId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ error: 'patientProfileId and a non-empty items array are required.' });
    }

    const order = await withTransaction(async (client) => {
      // 1. Generate unique sequential/deterministic order ID (e.g., CB-MED-0002)
      const countRes = await client.query('SELECT COUNT(*) FROM medicine_orders;');
      const nextNum = parseInt(countRes.rows[0].count, 10) + 1;
      const orderId = `CB-MED-${nextNum.toString().padStart(4, '0')}`;

      // 2. Insert into medicine_orders
      const orderSql = `
        INSERT INTO medicine_orders (
          order_id, patient_profile_id, prescription_id, store_id,
          total_items, status, delivery_address
        ) VALUES ($1, $2, $3, $4, $5, 'Placed', $6)
        RETURNING *;
      `;

      const orderRes = await client.query(orderSql, [
        orderId,
        patientProfileId,
        prescriptionId || null,
        storeId || null,
        items.length,
        deliveryAddress || 'Standard Delivery'
      ]);

      const createdOrder = orderRes.rows[0];

      // 3. Insert items into medicine_order_items
      for (const item of items) {
        await client.query(
          `INSERT INTO medicine_order_items (order_id, medicine_name, quantity, price)
           VALUES ($1, $2, $3, $4);`,
          [orderId, item.name || item.medicineName, item.quantity || 1, item.price || 0.00]
        );
      }

      return {
        ...createdOrder,
        items
      };
    });

    res.status(201).json({
      message: 'Medicine order placed successfully.',
      order
    });
  } catch (err) {
    next(err);
  }
}

// Get medicine orders
async function getMedicineOrders(req, res, next) {
  try {
    const { patientProfileId } = req.query;

    let sql = `
      SELECT mo.id, mo.order_id, mo.patient_profile_id, mo.prescription_id,
             mo.store_id, mo.total_items, mo.status, mo.delivery_address,
             mo.ordered_at, ms.name AS store_name,
             COALESCE(
               json_agg(
                 json_build_object(
                   'id', moi.id,
                   'medicineName', moi.medicine_name,
                   'quantity', moi.quantity,
                   'price', moi.price
                 )
               ) FILTER (WHERE moi.id IS NOT NULL), '[]'
             ) AS items
      FROM medicine_orders mo
      LEFT JOIN medical_stores ms ON mo.store_id = ms.store_id
      LEFT JOIN medicine_order_items moi ON mo.order_id = moi.order_id
    `;
    const params = [];

    if (patientProfileId) {
      params.push(patientProfileId);
      sql += ` WHERE mo.patient_profile_id = $1`;
    }

    sql += ` GROUP BY mo.id, ms.name ORDER BY mo.ordered_at DESC;`;

    const result = await query(sql, params);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getPrescriptions,
  getPrescriptionById,
  createMedicineOrder,
  getMedicineOrders
};
