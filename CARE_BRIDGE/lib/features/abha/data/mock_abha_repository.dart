import '../domain/abha_profile.dart';
import '../domain/abha_repository.dart';

/// Mock implementation of [AbhaRepository] for demo and testing.
class MockAbhaRepository implements AbhaRepository {
  /// Simulated latency in milliseconds.
  final int simulatedDelayMs;

  MockAbhaRepository({this.simulatedDelayMs = 0});

  @override
  Future<List<AbhaProfile>> findProfilesByMobile(String mobileNumber) =>
      fetchProfilesForMobile(mobileNumber);

  @override
  Future<List<AbhaProfile>> fetchProfilesForMobile(String mobileNumber) async {
    if (simulatedDelayMs > 0) {
      await Future<void>.delayed(Duration(milliseconds: simulatedDelayMs));
    }

    final cleanMobile = mobileNumber.replaceAll(RegExp(r'\D'), '');

    // Return empty list for numbers ending in 0000 or 9876500000 (triggers "No ABHA profile found" flow)
    if (cleanMobile.endsWith('0000') || cleanMobile == '9876500000') {
      return [];
    }

    // Scenario 1: Exactly 1 profile (Self)
    if (cleanMobile == '9876500001') {
      return [
        AbhaProfile(
          id: '12-3456-7890-1001',
          abhaAddress: 'ramesh.kumar@abdm',
          abhaNumber: '12-3456-7890-1001',
          name: 'Ramesh Kumar',
          gender: 'Male',
          dateOfBirth: '1979-05-15',
          relationship: 'Self',
          mobileNumber: cleanMobile,
          address: '14 Bazaar Street, Suramangalam',
          district: 'Salem',
          city: 'Salem',
          state: 'Tamil Nadu',
          pincode: '636001',
          email: 'ramesh.kumar@example.com',
          createdAt: '2024-01-10T10:30:00Z',
        ),
      ];
    }

    // Scenario 2: Exactly 2 profiles (Self + Spouse)
    if (cleanMobile == '9876500002') {
      return [
        AbhaProfile(
          id: '23-4567-8901-2001',
          abhaAddress: 'priya.sundaram@abdm',
          abhaNumber: '23-4567-8901-2001',
          name: 'Priya Sundaram',
          gender: 'Female',
          dateOfBirth: '1988-03-12',
          relationship: 'Self',
          mobileNumber: cleanMobile,
          address: '45 Cross Cut Road, Gandhipuram',
          district: 'Coimbatore',
          city: 'Coimbatore',
          state: 'Tamil Nadu',
          pincode: '641001',
          email: 'priya.sundaram@example.com',
          createdAt: '2024-02-14T09:15:00Z',
        ),
        AbhaProfile(
          id: '34-5678-9012-2002',
          abhaAddress: 'karthik.sundaram@abdm',
          abhaNumber: '34-5678-9012-2002',
          name: 'Karthik Sundaram',
          gender: 'Male',
          dateOfBirth: '1985-11-20',
          relationship: 'Spouse',
          mobileNumber: cleanMobile,
          address: '45 Cross Cut Road, Gandhipuram',
          district: 'Coimbatore',
          city: 'Coimbatore',
          state: 'Tamil Nadu',
          pincode: '641001',
          email: 'karthik.sundaram@example.com',
          createdAt: '2024-02-14T09:20:00Z',
        ),
      ];
    }

    // Scenario 3: Exactly 3 profiles (Self + Spouse + Child)
    if (cleanMobile == '9876500003') {
      return [
        AbhaProfile(
          id: '45-6789-0123-3001',
          abhaAddress: 'murugan.palani@abdm',
          abhaNumber: '45-6789-0123-3001',
          name: 'Murugan Palani',
          gender: 'Male',
          dateOfBirth: '1975-07-10',
          relationship: 'Self',
          mobileNumber: cleanMobile,
          address: '12 Temple View Lane, South Gate',
          district: 'Madurai',
          city: 'Madurai',
          state: 'Tamil Nadu',
          pincode: '625001',
          email: 'murugan.palani@example.com',
          createdAt: '2024-01-25T11:00:00Z',
        ),
        AbhaProfile(
          id: '56-7890-1234-3002',
          abhaAddress: 'lakshmi.murugan@abdm',
          abhaNumber: '56-7890-1234-3002',
          name: 'Lakshmi Murugan',
          gender: 'Female',
          dateOfBirth: '1980-04-18',
          relationship: 'Spouse',
          mobileNumber: cleanMobile,
          address: '12 Temple View Lane, South Gate',
          district: 'Madurai',
          city: 'Madurai',
          state: 'Tamil Nadu',
          pincode: '625001',
          email: 'lakshmi.murugan@example.com',
          createdAt: '2024-01-25T11:05:00Z',
        ),
        AbhaProfile(
          id: '67-8901-2345-3003',
          abhaAddress: 'kavin.murugan@abdm',
          abhaNumber: '67-8901-2345-3003',
          name: 'Kavin Murugan',
          gender: 'Male',
          dateOfBirth: '2010-09-25',
          relationship: 'Child',
          mobileNumber: cleanMobile,
          address: '12 Temple View Lane, South Gate',
          district: 'Madurai',
          city: 'Madurai',
          state: 'Tamil Nadu',
          pincode: '625001',
          email: 'kavin.murugan@example.com',
          createdAt: '2024-01-25T11:10:00Z',
        ),
      ];
    }

    // Scenario 4: Exactly 4 profiles (Self + Spouse + Child + Parent)
    if (cleanMobile == '9876500004') {
      return [
        AbhaProfile(
          id: '78-9012-3456-4001',
          abhaAddress: 'selvi.anbarasan@abdm',
          abhaNumber: '78-9012-3456-4001',
          name: 'Selvi Anbarasan',
          gender: 'Female',
          dateOfBirth: '1982-12-05',
          relationship: 'Self',
          mobileNumber: cleanMobile,
          address: '28 Main Road, Thillai Nagar',
          district: 'Trichy',
          city: 'Tiruchirappalli',
          state: 'Tamil Nadu',
          pincode: '620001',
          email: 'selvi.anbarasan@example.com',
          createdAt: '2024-03-01T08:30:00Z',
        ),
        AbhaProfile(
          id: '89-0123-4567-4002',
          abhaAddress: 'anbarasan.natarajan@abdm',
          abhaNumber: '89-0123-4567-4002',
          name: 'Anbarasan Natarajan',
          gender: 'Male',
          dateOfBirth: '1978-06-14',
          relationship: 'Spouse',
          mobileNumber: cleanMobile,
          address: '28 Main Road, Thillai Nagar',
          district: 'Trichy',
          city: 'Tiruchirappalli',
          state: 'Tamil Nadu',
          pincode: '620001',
          email: 'anbarasan.natarajan@example.com',
          createdAt: '2024-03-01T08:35:00Z',
        ),
        AbhaProfile(
          id: '90-1234-5678-4003',
          abhaAddress: 'diya.anbarasan@abdm',
          abhaNumber: '90-1234-5678-4003',
          name: 'Diya Anbarasan',
          gender: 'Female',
          dateOfBirth: '2012-08-30',
          relationship: 'Child',
          mobileNumber: cleanMobile,
          address: '28 Main Road, Thillai Nagar',
          district: 'Trichy',
          city: 'Tiruchirappalli',
          state: 'Tamil Nadu',
          pincode: '620001',
          email: 'diya.anbarasan@example.com',
          createdAt: '2024-03-01T08:40:00Z',
        ),
        AbhaProfile(
          id: '11-2233-4455-4004',
          abhaAddress: 'natarajan.chettiar@abdm',
          abhaNumber: '11-2233-4455-4004',
          name: 'Natarajan Chettiar',
          gender: 'Male',
          dateOfBirth: '1952-02-18',
          relationship: 'Parent',
          mobileNumber: cleanMobile,
          address: '28 Main Road, Thillai Nagar',
          district: 'Trichy',
          city: 'Tiruchirappalli',
          state: 'Tamil Nadu',
          pincode: '620001',
          email: 'natarajan.chettiar@example.com',
          createdAt: '2024-03-01T08:45:00Z',
        ),
      ];
    }

    // Scenario 5: Mobile 9876543210 -> Exactly 2 Profiles (Default CareBridge Demo)
    if (cleanMobile == '9876543210') {
      return [
        AbhaProfile(
          id: '12-3456-7890-1234',
          abhaAddress: 'ramesh.k@abdm',
          abhaNumber: '12-3456-7890-1234',
          name: 'Ramesh Kumar',
          gender: 'Male',
          dateOfBirth: '1979-05-15',
          relationship: 'Self',
          mobileNumber: cleanMobile,
          address: '14 Bazaar Street, Suramangalam',
          district: 'Salem',
          city: 'Salem',
          state: 'Tamil Nadu',
          pincode: '636001',
          email: 'ramesh.k@example.com',
          createdAt: '2024-01-01T10:00:00Z',
        ),
        AbhaProfile(
          id: '98-7654-3210-4321',
          abhaAddress: 'sunita.k@abdm',
          abhaNumber: '98-7654-3210-4321',
          name: 'Sunita Kumar',
          gender: 'Female',
          dateOfBirth: '1982-08-22',
          relationship: 'Spouse',
          mobileNumber: cleanMobile,
          address: '14 Bazaar Street, Suramangalam',
          district: 'Salem',
          city: 'Salem',
          state: 'Tamil Nadu',
          pincode: '636001',
          email: 'sunita.k@example.com',
          createdAt: '2024-01-01T10:05:00Z',
        ),
      ];
    }

    // Cluster 6: Mobile 9876500011 -> 3 Profiles (Self + Spouse + Parent, Chennai)
    if (cleanMobile == '9876500011') {
      return [
        AbhaProfile(
          id: '14-2536-4758-1101',
          abhaAddress: 'vijay.raghavan@abdm',
          abhaNumber: '14-2536-4758-1101',
          name: 'Vijay Raghavan',
          gender: 'Male',
          dateOfBirth: '1984-01-19',
          relationship: 'Self',
          mobileNumber: cleanMobile,
          district: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600001',
        ),
        AbhaProfile(
          id: '25-3647-5869-1102',
          abhaAddress: 'anitha.vijay@abdm',
          abhaNumber: '25-3647-5869-1102',
          name: 'Anitha Vijay',
          gender: 'Female',
          dateOfBirth: '1987-10-08',
          relationship: 'Spouse',
          mobileNumber: cleanMobile,
          district: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600001',
        ),
        AbhaProfile(
          id: '36-4758-6970-1103',
          abhaAddress: 'raghavan.swamy@abdm',
          abhaNumber: '36-4758-6970-1103',
          name: 'Raghavan Swamy',
          gender: 'Male',
          dateOfBirth: '1955-04-12',
          relationship: 'Parent',
          mobileNumber: cleanMobile,
          district: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600001',
        ),
      ];
    }

    // Cluster 7: Mobile 9876500012 -> 3 Profiles (Self + Spouse + Child, Erode)
    if (cleanMobile == '9876500012') {
      return [
        AbhaProfile(
          id: '47-5869-7081-1201',
          abhaAddress: 'senthil.kumar@abdm',
          abhaNumber: '47-5869-7081-1201',
          name: 'Senthil Kumar',
          gender: 'Male',
          dateOfBirth: '1981-09-03',
          relationship: 'Self',
          mobileNumber: cleanMobile,
          district: 'Erode',
          state: 'Tamil Nadu',
          pincode: '638001',
        ),
        AbhaProfile(
          id: '58-6970-8192-1202',
          abhaAddress: 'poongodi.senthil@abdm',
          abhaNumber: '58-6970-8192-1202',
          name: 'Poongodi Senthil',
          gender: 'Female',
          dateOfBirth: '1986-07-21',
          relationship: 'Spouse',
          mobileNumber: cleanMobile,
          district: 'Erode',
          state: 'Tamil Nadu',
          pincode: '638001',
        ),
        AbhaProfile(
          id: '69-7081-9203-1203',
          abhaAddress: 'tharun.senthil@abdm',
          abhaNumber: '69-7081-9203-1203',
          name: 'Tharun Senthil',
          gender: 'Male',
          dateOfBirth: '2014-03-17',
          relationship: 'Child',
          mobileNumber: cleanMobile,
          district: 'Erode',
          state: 'Tamil Nadu',
          pincode: '638001',
        ),
      ];
    }

    // Cluster 8: Mobile 9876500013 -> 4 Profiles (Self + Spouse + Child + Parent, Salem)
    if (cleanMobile == '9876500013') {
      return [
        AbhaProfile(
          id: '70-8192-0314-1301',
          abhaAddress: 'saravanan.subramani@abdm',
          abhaNumber: '70-8192-0314-1301',
          name: 'Saravanan Subramani',
          gender: 'Male',
          dateOfBirth: '1977-11-14',
          relationship: 'Self',
          mobileNumber: cleanMobile,
          district: 'Salem',
          state: 'Tamil Nadu',
          pincode: '636007',
        ),
        AbhaProfile(
          id: '81-9203-1425-1302',
          abhaAddress: 'malarvizhi.saravanan@abdm',
          abhaNumber: '81-9203-1425-1302',
          name: 'Malarvizhi Saravanan',
          gender: 'Female',
          dateOfBirth: '1983-05-29',
          relationship: 'Spouse',
          mobileNumber: cleanMobile,
          district: 'Salem',
          state: 'Tamil Nadu',
          pincode: '636007',
        ),
        AbhaProfile(
          id: '92-0314-2536-1303',
          abhaAddress: 'nithya.saravanan@abdm',
          abhaNumber: '92-0314-2536-1303',
          name: 'Nithya Saravanan',
          gender: 'Female',
          dateOfBirth: '2011-12-08',
          relationship: 'Child',
          mobileNumber: cleanMobile,
          district: 'Salem',
          state: 'Tamil Nadu',
          pincode: '636007',
        ),
        AbhaProfile(
          id: '13-2435-4657-1304',
          abhaAddress: 'subramani.kounder@abdm',
          abhaNumber: '13-2435-4657-1304',
          name: 'Subramani Kounder',
          gender: 'Male',
          dateOfBirth: '1950-08-15',
          relationship: 'Parent',
          mobileNumber: cleanMobile,
          district: 'Salem',
          state: 'Tamil Nadu',
          pincode: '636007',
        ),
      ];
    }

    // Cluster 9: Mobile 9876500014 -> 2 Profiles (Self + Child, Namakkal)
    if (cleanMobile == '9876500014') {
      return [
        AbhaProfile(
          id: '24-3546-5768-1401',
          abhaAddress: 'deepa.ganesan@abdm',
          abhaNumber: '24-3546-5768-1401',
          name: 'Deepa Ganesan',
          gender: 'Female',
          dateOfBirth: '1990-02-14',
          relationship: 'Self',
          mobileNumber: cleanMobile,
          district: 'Namakkal',
          state: 'Tamil Nadu',
          pincode: '637001',
        ),
        AbhaProfile(
          id: '35-4657-6879-1402',
          abhaAddress: 'pranav.ganesan@abdm',
          abhaNumber: '35-4657-6879-1402',
          name: 'Pranav Ganesan',
          gender: 'Male',
          dateOfBirth: '2016-06-23',
          relationship: 'Child',
          mobileNumber: cleanMobile,
          district: 'Namakkal',
          state: 'Tamil Nadu',
          pincode: '637001',
        ),
      ];
    }

    // Cluster 10: Mobile 9876500015 -> 3 Profiles (Self + Spouse + Child, Dharmapuri)
    if (cleanMobile == '9876500015') {
      return [
        AbhaProfile(
          id: '46-5768-7980-1501',
          abhaAddress: 'madhan.raj@abdm',
          abhaNumber: '46-5768-7980-1501',
          name: 'Madhan Raj',
          gender: 'Male',
          dateOfBirth: '1986-12-19',
          relationship: 'Self',
          mobileNumber: cleanMobile,
          district: 'Dharmapuri',
          state: 'Tamil Nadu',
          pincode: '636701',
        ),
        AbhaProfile(
          id: '57-6879-8091-1502',
          abhaAddress: 'bhuvaneswari.madhan@abdm',
          abhaNumber: '57-6879-8091-1502',
          name: 'Bhuvaneswari Madhan',
          gender: 'Female',
          dateOfBirth: '1989-08-04',
          relationship: 'Spouse',
          mobileNumber: cleanMobile,
          district: 'Dharmapuri',
          state: 'Tamil Nadu',
          pincode: '636701',
        ),
        AbhaProfile(
          id: '68-7980-9102-1503',
          abhaAddress: 'yazhini.madhan@abdm',
          abhaNumber: '68-7980-9102-1503',
          name: 'Yazhini Madhan',
          gender: 'Female',
          dateOfBirth: '2017-01-11',
          relationship: 'Child',
          mobileNumber: cleanMobile,
          district: 'Dharmapuri',
          state: 'Tamil Nadu',
          pincode: '636701',
        ),
      ];
    }

    // Cluster 11: Mobile 9876500016 -> 2 Profiles (Self + Parent, Coimbatore)
    if (cleanMobile == '9876500016') {
      return [
        AbhaProfile(
          id: '79-8091-0213-1601',
          abhaAddress: 'arun.venkatesh@abdm',
          abhaNumber: '79-8091-0213-1601',
          name: 'Arun Venkatesh',
          gender: 'Male',
          dateOfBirth: '1992-06-27',
          relationship: 'Self',
          mobileNumber: cleanMobile,
          district: 'Coimbatore',
          state: 'Tamil Nadu',
          pincode: '641018',
        ),
        AbhaProfile(
          id: '80-9102-1324-1602',
          abhaAddress: 'kamalam.venkatesh@abdm',
          abhaNumber: '80-9102-1324-1602',
          name: 'Kamalam Venkatesh',
          gender: 'Female',
          dateOfBirth: '1962-03-30',
          relationship: 'Parent',
          mobileNumber: cleanMobile,
          district: 'Coimbatore',
          state: 'Tamil Nadu',
          pincode: '641018',
        ),
      ];
    }

    // Cluster 12: Mobile 9876500017 -> 2 Profiles (Self + Spouse, Madurai)
    if (cleanMobile == '9876500017') {
      return [
        AbhaProfile(
          id: '91-0213-2435-1701',
          abhaAddress: 'gopal.krishnan@abdm',
          abhaNumber: '91-0213-2435-1701',
          name: 'Gopal Krishnan',
          gender: 'Male',
          dateOfBirth: '1983-04-16',
          relationship: 'Self',
          mobileNumber: cleanMobile,
          district: 'Madurai',
          state: 'Tamil Nadu',
          pincode: '625020',
        ),
        AbhaProfile(
          id: '15-2637-4859-1702',
          abhaAddress: 'vasuki.gopal@abdm',
          abhaNumber: '15-2637-4859-1702',
          name: 'Vasuki Gopal',
          gender: 'Female',
          dateOfBirth: '1987-09-09',
          relationship: 'Spouse',
          mobileNumber: cleanMobile,
          district: 'Madurai',
          state: 'Tamil Nadu',
          pincode: '625020',
        ),
      ];
    }

    // Individual Profiles: 9876500018 through 9876500022 -> Exactly 1 Profile Each (Self)
    if (cleanMobile == '9876500018') {
      return [
        AbhaProfile(
          id: '26-3748-5960-1801',
          abhaAddress: 'revathi.shankar@abdm',
          abhaNumber: '26-3748-5960-1801',
          name: 'Revathi Shankar',
          gender: 'Female',
          dateOfBirth: '1995-10-12',
          relationship: 'Self',
          mobileNumber: cleanMobile,
          district: 'Trichy',
          state: 'Tamil Nadu',
          pincode: '620015',
        ),
      ];
    }
    if (cleanMobile == '9876500019') {
      return [
        AbhaProfile(
          id: '37-4859-6071-1901',
          abhaAddress: 'manikandan.velu@abdm',
          abhaNumber: '37-4859-6071-1901',
          name: 'Manikandan Velu',
          gender: 'Male',
          dateOfBirth: '1991-01-28',
          relationship: 'Self',
          mobileNumber: cleanMobile,
          district: 'Chennai',
          state: 'Tamil Nadu',
          pincode: '600028',
        ),
      ];
    }
    if (cleanMobile == '9876500020') {
      return [
        AbhaProfile(
          id: '48-5960-7182-2001',
          abhaAddress: 'kavitha.dharmalingam@abdm',
          abhaNumber: '48-5960-7182-2001',
          name: 'Kavitha Dharmalingam',
          gender: 'Female',
          dateOfBirth: '1989-11-03',
          relationship: 'Self',
          mobileNumber: cleanMobile,
          district: 'Salem',
          state: 'Tamil Nadu',
          pincode: '636004',
        ),
      ];
    }
    if (cleanMobile == '9876500021') {
      return [
        AbhaProfile(
          id: '59-6071-8293-2101',
          abhaAddress: 'balaji.srinivasan@abdm',
          abhaNumber: '59-6071-8293-2101',
          name: 'Balaji Srinivasan',
          gender: 'Male',
          dateOfBirth: '1993-07-22',
          relationship: 'Self',
          mobileNumber: cleanMobile,
          district: 'Erode',
          state: 'Tamil Nadu',
          pincode: '638009',
        ),
      ];
    }
    if (cleanMobile == '9876500022') {
      return [
        AbhaProfile(
          id: '60-7182-9304-2201',
          abhaAddress: 'sandhya.nandakumar@abdm',
          abhaNumber: '60-7182-9304-2201',
          name: 'Sandhya Nandakumar',
          gender: 'Female',
          dateOfBirth: '1996-05-18',
          relationship: 'Self',
          mobileNumber: cleanMobile,
          district: 'Namakkal',
          state: 'Tamil Nadu',
          pincode: '637002',
        ),
      ];
    }

    // Any mobile number NOT in the synthetic dataset returns an empty list
    // (triggers the "Create ABHA Card" screen)
    return [];
  }

  @override
  Future<void> selectProfile(AbhaProfile profile) async {
    if (simulatedDelayMs > 0) {
      await Future<void>.delayed(Duration(milliseconds: simulatedDelayMs));
    }
  }
}
