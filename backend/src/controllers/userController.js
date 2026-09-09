const bcrypt = require('bcryptjs');
const { query } = require('../config/db');

// List all dashboard users (Admin only)
async function getUsers(req, res, next) {
  try {
    const sql = `
      SELECT u.id, u.username, u.email, u.full_name, u.employee_id,
             u.district, u.is_active, u.created_at, u.updated_at,
             r.id AS role_id, r.name AS role_name
      FROM users u
      JOIN roles r ON u.role_id = r.id
      ORDER BY u.id ASC;
    `;
    const result = await query(sql);
    res.json(result.rows);
  } catch (err) {
    next(err);
  }
}

// Create new dashboard user (Admin only)
async function createUser(req, res, next) {
  try {
    const { name, username, email, employeeId, password, role, district, isActive } = req.body;

    if (!name || !username || !email || !password) {
      return res.status(400).json({ error: 'Name, username, email, and password are required.' });
    }

    if (password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    // Role lookup
    const targetRole = (role || 'GOVERNMENT').toUpperCase();
    const roleRes = await query('SELECT id FROM roles WHERE UPPER(name) = $1 LIMIT 1;', [targetRole]);
    if (roleRes.rows.length === 0) {
      return res.status(400).json({ error: `Invalid role specified: ${role}` });
    }
    const roleId = roleRes.rows[0].id;

    // Check duplicate username/email
    const dupCheck = await query(
      'SELECT id FROM users WHERE LOWER(username) = LOWER($1) OR LOWER(email) = LOWER($2) LIMIT 1;',
      [username.trim(), email.trim()]
    );
    if (dupCheck.rows.length > 0) {
      return res.status(409).json({ error: 'A user with this username or email already exists.' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const empId = employeeId ? employeeId.trim().toUpperCase() : `EMP-${Math.floor(1000 + Math.random() * 9000)}`;

    const insertSql = `
      INSERT INTO users (username, email, password_hash, role_id, full_name, employee_id, district, is_active)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING id, username, email, full_name, employee_id, district, is_active, created_at;
    `;

    const result = await query(insertSql, [
      username.trim(),
      email.trim(),
      passwordHash,
      roleId,
      name.trim(),
      empId,
      district || 'Salem',
      isActive !== undefined ? isActive : true
    ]);

    res.status(201).json({
      message: 'User created successfully.',
      user: { ...result.rows[0], role_name: targetRole }
    });
  } catch (err) {
    next(err);
  }
}

// Update user (Admin only)
async function updateUser(req, res, next) {
  try {
    const { id } = req.params;
    const { name, email, role, district, isActive, password } = req.body;

    const userCheck = await query('SELECT * FROM users WHERE id = $1;', [id]);
    if (userCheck.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    let roleId = userCheck.rows[0].role_id;
    if (role) {
      const roleRes = await query('SELECT id FROM roles WHERE UPPER(name) = $1 LIMIT 1;', [role.toUpperCase()]);
      if (roleRes.rows.length > 0) roleId = roleRes.rows[0].id;
    }

    let passwordHash = userCheck.rows[0].password_hash;
    if (password && password.trim().length >= 6) {
      passwordHash = await bcrypt.hash(password.trim(), 10);
    }

    const updateSql = `
      UPDATE users
      SET full_name = COALESCE($1, full_name),
          email = COALESCE($2, email),
          role_id = $3,
          district = COALESCE($4, district),
          is_active = COALESCE($5, is_active),
          password_hash = $6,
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $7
      RETURNING id, username, email, full_name, employee_id, district, is_active, updated_at;
    `;

    const result = await query(updateSql, [
      name || null,
      email || null,
      roleId,
      district || null,
      isActive !== undefined ? isActive : null,
      passwordHash,
      id
    ]);

    res.json({
      message: 'User updated successfully.',
      user: result.rows[0]
    });
  } catch (err) {
    next(err);
  }
}

// Deactivate user (Admin only)
async function deleteUser(req, res, next) {
  try {
    const { id } = req.params;
    const result = await query(
      'UPDATE users SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP WHERE id = $1 RETURNING id, username, is_active;',
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    res.json({ message: 'User account deactivated successfully.', user: result.rows[0] });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser
};
