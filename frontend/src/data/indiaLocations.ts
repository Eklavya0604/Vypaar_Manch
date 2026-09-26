export interface LocationData {
  states: {
    [key: string]: {
      name: string;
      cities: string[];
    };
  };
}

export const indiaLocations: LocationData = {
  states: {
    'AN': {
      name: 'Andaman and Nicobar Islands',
      cities: ['Port Blair', 'Diglipur', 'Rangat', 'Mayabunder', 'Car Nicobar']
    },
    'AP': {
      name: 'Andhra Pradesh',
      cities: ['Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool', 'Rajahmundry', 'Tirupati', 'Kadapa', 'Kakinada', 'Anantapur', 'Eluru', 'Ongole', 'Nandyal', 'Machilipatnam', 'Adoni', 'Tenali', 'Proddatur', 'Chittoor', 'Hindupur', 'Srikakulam']
    },
    'AR': {
      name: 'Arunachal Pradesh',
      cities: ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro', 'Bomdila', 'Tezu', 'Aalo', 'Khonsa', 'Roing']
    },
    'AS': {
      name: 'Assam',
      cities: ['Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia', 'Tezpur', 'Bongaigaon', 'Diphu', 'North Lakhimpur', 'Dhubri', 'Karimganj', 'Sivasagar', 'Goalpara', 'Barpeta']
    },
    'BR': {
      name: 'Bihar',
      cities: ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Purnia', 'Darbhanga', 'Bihar Sharif', 'Arrah', 'Begusarai', 'Katihar', 'Munger', 'Chhapra', 'Samastipur', 'Hajipur', 'Sasaram', 'Dehri', 'Siwan', 'Motihari', 'Nawada', 'Bagaha']
    },
    'CH': {
      name: 'Chandigarh',
      cities: ['Chandigarh']
    },
    'CG': {
      name: 'Chhattisgarh',
      cities: ['Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg', 'Rajnandgaon', 'Raigarh', 'Jagdalpur', 'Ambikapur', 'Dhamtari', 'Chirmiri', 'Mahasamund', 'Kawardha', 'Kondagaon']
    },
    'DD': {
      name: 'Dadra and Nagar Haveli and Daman and Diu',
      cities: ['Silvassa', 'Daman', 'Diu']
    },
    'DL': {
      name: 'Delhi',
      cities: ['New Delhi', 'Delhi', 'Dwarka', 'Rohini', 'Pitampura', 'Janakpuri', 'Karol Bagh', 'Lajpat Nagar', 'Saket', 'Vasant Kunj', 'Noida Extension', 'Greater Kailash', 'Hauz Khas', 'Connaught Place', 'Chandni Chowk']
    },
    'GA': {
      name: 'Goa',
      cities: ['Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Bicholim', 'Curchorem', 'Canacona', 'Sanguem', 'Quepem']
    },
    'GJ': {
      name: 'Gujarat',
      cities: ['Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar', 'Junagadh', 'Gandhinagar', 'Anand', 'Nadiad', 'Morbi', 'Mehsana', 'Bharuch', 'Vapi', 'Navsari', 'Veraval', 'Porbandar', 'Godhra', 'Palanpur', 'Bhuj']
    },
    'HR': {
      name: 'Haryana',
      cities: ['Faridabad', 'Gurgaon', 'Panipat', 'Ambala', 'Yamunanagar', 'Rohtak', 'Hisar', 'Karnal', 'Sonipat', 'Panchkula', 'Bhiwani', 'Sirsa', 'Bahadurgarh', 'Jind', 'Thanesar', 'Kaithal', 'Rewari', 'Palwal']
    },
    'HP': {
      name: 'Himachal Pradesh',
      cities: ['Shimla', 'Solan', 'Dharamshala', 'Mandi', 'Palampur', 'Baddi', 'Nahan', 'Paonta Sahib', 'Sundarnagar', 'Kullu', 'Manali', 'Chamba', 'Una', 'Hamirpur', 'Bilaspur']
    },
    'JK': {
      name: 'Jammu and Kashmir',
      cities: ['Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Sopore', 'Udhampur', 'Kathua', 'Poonch', 'Rajouri', 'Pulwama', 'Ganderbal', 'Kupwara', 'Leh', 'Kargil']
    },
    'JH': {
      name: 'Jharkhand',
      cities: ['Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar', 'Hazaribagh', 'Giridih', 'Ramgarh', 'Medininagar', 'Chirkunda', 'Phusro', 'Adityapur', 'Chaibasa', 'Dumka', 'Gumla']
    },
    'KA': {
      name: 'Karnataka',
      cities: ['Bangalore', 'Mysore', 'Hubli', 'Mangalore', 'Belgaum', 'Gulbarga', 'Davanagere', 'Bellary', 'Bijapur', 'Shimoga', 'Tumkur', 'Raichur', 'Bidar', 'Hospet', 'Hassan', 'Udupi', 'Chitradurga', 'Kolar', 'Mandya', 'Chikmagalur']
    },
    'KL': {
      name: 'Kerala',
      cities: ['Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam', 'Palakkad', 'Alappuzha', 'Kannur', 'Kottayam', 'Malappuram', 'Kasaragod', 'Pathanamthitta', 'Idukki', 'Wayanad', 'Ernakulam']
    },
    'LA': {
      name: 'Ladakh',
      cities: ['Leh', 'Kargil']
    },
    'LD': {
      name: 'Lakshadweep',
      cities: ['Kavaratti', 'Agatti', 'Minicoy', 'Andrott']
    },
    'MP': {
      name: 'Madhya Pradesh',
      cities: ['Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain', 'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa', 'Murwara', 'Singrauli', 'Burhanpur', 'Khandwa', 'Bhind', 'Chhindwara', 'Guna', 'Shivpuri', 'Vidisha', 'Damoh']
    },
    'MH': {
      name: 'Maharashtra',
      cities: ['Mumbai', 'Pune', 'Nagpur', 'Thane', 'Nashik', 'Aurangabad', 'Solapur', 'Kolhapur', 'Amravati', 'Nanded', 'Sangli', 'Malegaon', 'Akola', 'Latur', 'Dhule', 'Ahmednagar', 'Chandrapur', 'Parbhani', 'Jalgaon', 'Bhiwandi', 'Navi Mumbai', 'Panvel', 'Satara', 'Ratnagiri', 'Wardha']
    },
    'MN': {
      name: 'Manipur',
      cities: ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Kakching', 'Senapati', 'Ukhrul', 'Tamenglong']
    },
    'ML': {
      name: 'Meghalaya',
      cities: ['Shillong', 'Tura', 'Jowai', 'Nongstoin', 'Williamnagar', 'Baghmara', 'Resubelpara', 'Mairang']
    },
    'MZ': {
      name: 'Mizoram',
      cities: ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip', 'Kolasib', 'Lawngtlai', 'Saiha', 'Mamit']
    },
    'NL': {
      name: 'Nagaland',
      cities: ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha', 'Zunheboto', 'Mon', 'Phek']
    },
    'OD': {
      name: 'Odisha',
      cities: ['Bhubaneswar', 'Cuttack', 'Rourkela', 'Brahmapur', 'Sambalpur', 'Puri', 'Balasore', 'Bhadrak', 'Baripada', 'Jharsuguda', 'Jeypore', 'Bargarh', 'Paradip', 'Bhawanipatna', 'Kendujhar']
    },
    'PY': {
      name: 'Puducherry',
      cities: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam']
    },
    'PB': {
      name: 'Punjab',
      cities: ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda', 'Mohali', 'Pathankot', 'Hoshiarpur', 'Batala', 'Moga', 'Abohar', 'Malerkotla', 'Khanna', 'Muktsar', 'Barnala', 'Rajpura', 'Firozpur', 'Kapurthala', 'Zirakpur']
    },
    'RJ': {
      name: 'Rajasthan',
      cities: ['Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Bhilwara', 'Alwar', 'Bharatpur', 'Sikar', 'Pali', 'Sri Ganganagar', 'Tonk', 'Beawar', 'Hanumangarh', 'Kishangarh', 'Sawai Madhopur', 'Nagaur', 'Makrana', 'Jhunjhunu']
    },
    'SK': {
      name: 'Sikkim',
      cities: ['Gangtok', 'Namchi', 'Gyalshing', 'Mangan', 'Rangpo', 'Singtam', 'Jorethang']
    },
    'TN': {
      name: 'Tamil Nadu',
      cities: ['Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tirunelveli', 'Tiruppur', 'Erode', 'Vellore', 'Thoothukudi', 'Dindigul', 'Thanjavur', 'Ranipet', 'Sivakasi', 'Karur', 'Udhagamandalam', 'Hosur', 'Nagercoil', 'Kanchipuram', 'Cuddalore']
    },
    'TS': {
      name: 'Telangana',
      cities: ['Hyderabad', 'Warangal', 'Nizamabad', 'Karimnagar', 'Ramagundam', 'Khammam', 'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Suryapet', 'Siddipet', 'Miryalaguda', 'Jagtial', 'Mancherial', 'Kamareddy']
    },
    'TR': {
      name: 'Tripura',
      cities: ['Agartala', 'Udaipur', 'Dharmanagar', 'Kailasahar', 'Belonia', 'Khowai', 'Ambassa', 'Sabroom']
    },
    'UP': {
      name: 'Uttar Pradesh',
      cities: ['Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Varanasi', 'Meerut', 'Prayagraj', 'Bareilly', 'Aligarh', 'Moradabad', 'Saharanpur', 'Gorakhpur', 'Noida', 'Firozabad', 'Jhansi', 'Muzaffarnagar', 'Mathura', 'Rampur', 'Shahjahanpur', 'Farrukhabad', 'Mau', 'Hapur', 'Etawah', 'Mirzapur', 'Bulandshahr', 'Sambhal', 'Amroha', 'Hardoi', 'Fatehpur', 'Raebareli']
    },
    'UK': {
      name: 'Uttarakhand',
      cities: ['Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur', 'Kashipur', 'Rishikesh', 'Nainital', 'Mussoorie', 'Almora', 'Pithoragarh', 'Kotdwar', 'Srinagar', 'Pauri', 'Tehri']
    },
    'WB': {
      name: 'West Bengal',
      cities: ['Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri', 'Bardhaman', 'Malda', 'Baharampur', 'Habra', 'Kharagpur', 'Shantipur', 'Dankuni', 'Dhulian', 'Ranaghat', 'Haldia', 'Raiganj', 'Krishnanagar', 'Nabadwip', 'Medinipur', 'Jalpaiguri', 'Balurghat', 'Basirhat', 'Bankura', 'Darjeeling']
    }
  }
};

export const getStates = (): { code: string; name: string }[] => {
  return Object.entries(indiaLocations.states).map(([code, data]) => ({
    code,
    name: data.name
  })).sort((a, b) => a.name.localeCompare(b.name));
};

export const getCitiesByState = (stateCode: string): string[] => {
  return indiaLocations.states[stateCode]?.cities || [];
};

export const getStateName = (stateCode: string): string => {
  return indiaLocations.states[stateCode]?.name || stateCode;
};

export const findStateCodeByName = (stateName: string): string | undefined => {
  const entry = Object.entries(indiaLocations.states).find(
    ([, data]) => data.name.toLowerCase() === stateName.toLowerCase()
  );
  return entry?.[0];
};

export const getAllCities = (): string[] => {
  const cities = new Set<string>();
  Object.values(indiaLocations.states).forEach(state => {
    state.cities.forEach(city => cities.add(city));
  });
  return Array.from(cities).sort();
};
