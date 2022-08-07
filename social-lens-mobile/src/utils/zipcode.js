export default (zipcode) => {
  let code = parseInt(zipcode);
  let state = null;

  // Code blocks alphabetized by state
  if (code >= 35000 && code <= 36999) {
    state = {
      abbr: "AL",
      name: "Alabama",
    };
  } else if (code >= 99500 && code <= 99999) {
    state = {
      abbr: "AK",
      name: "Alaska",
    };
  } else if (code >= 85000 && code <= 86999) {
    state = {
      abbr: "AZ",
      name: "Arizona",
    };
  } else if (code >= 71600 && code <= 72999) {
    state = {
      abbr: "AR",
      name: "Arkansas",
    };
  } else if (code >= 90000 && code <= 96699) {
    state = {
      abbr: "CA",
      name: "California",
    };
  } else if (code >= 80000 && code <= 81999) {
    state = {
      abbr: "CO",
      name: "Colorado",
    };
  } else if (code >= 6000 && code <= 6999) {
    state = {
      abbr: "CT",
      name: "Connecticut",
    };
  } else if (code >= 19700 && code <= 19999) {
    state = {
      abbr: "DE",
      name: "Deleware",
    };
  } else if (code >= 32000 && code <= 34999) {
    state = {
      abbr: "FL",
      name: "Florida",
    };
  } else if (code >= 30000 && code <= 31999) {
    state = {
      abbr: "GA",
      name: "Georgia",
    };
  } else if (code >= 96700 && code <= 96999) {
    state = {
      abbr: "HI",
      name: "Hawaii",
    };
  } else if (code >= 83200 && code <= 83999) {
    state = {
      abbr: "ID",
      name: "Idaho",
    };
  } else if (code >= 60000 && code <= 62999) {
    state = {
      abbr: "IL",
      name: "Illinois",
    };
  } else if (code >= 46000 && code <= 47999) {
    state = {
      abbr: "IN",
      name: "Indiana",
    };
  } else if (code >= 50000 && code <= 52999) {
    state = {
      abbr: "IA",
      name: "Iowa",
    };
  } else if (code >= 66000 && code <= 67999) {
    state = {
      abbr: "KS",
      name: "Kansas",
    };
  } else if (code >= 40000 && code <= 42999) {
    state = {
      abbr: "KY",
      name: "Kentucky",
    };
  } else if (code >= 70000 && code <= 71599) {
    state = {
      abbr: "LA",
      name: "Louisiana",
    };
  } else if (code >= 3900 && code <= 4999) {
    state = {
      abbr: "ME",
      name: "Maine",
    };
  } else if (code >= 20600 && code <= 21999) {
    state = {
      abbr: "MD",
      name: "Maryland",
    };
  } else if (code >= 1000 && code <= 2799) {
    state = {
      abbr: "MA",
      name: "Massachusetts",
    };
  } else if (code >= 48000 && code <= 49999) {
    state = {
      abbr: "MI",
      name: "Michigan",
    };
  } else if (code >= 55000 && code <= 56999) {
    state = {
      abbr: "MN",
      name: "Minnesota",
    };
  } else if (code >= 38600 && code <= 39999) {
    state = {
      abbr: "MS",
      name: "Mississippi",
    };
  } else if (code >= 63000 && code <= 65999) {
    state = {
      abbr: "MO",
      name: "Missouri",
    };
  } else if (code >= 59000 && code <= 59999) {
    state = {
      abbr: "MT",
      name: "Montana",
    };
  } else if (code >= 27000 && code <= 28999) {
    state = {
      abbr: "NC",
      name: "North Carolina",
    };
  } else if (code >= 58000 && code <= 58999) {
    state = {
      abbr: "ND",
      name: "North Dakota",
    };
  } else if (code >= 68000 && code <= 69999) {
    state = {
      abbr: "NE",
      name: "Nebraska",
    };
  } else if (code >= 88900 && code <= 89999) {
    state = {
      abbr: "NV",
      name: "Nevada",
    };
  } else if (code >= 3000 && code <= 3899) {
    state = {
      abbr: "NH",
      name: "New Hampshire",
    };
  } else if (code >= 7000 && code <= 8999) {
    state = {
      abbr: "NJ",
      name: "New Jersey",
    };
  } else if (code >= 87000 && code <= 88499) {
    state = {
      abbr: "NM",
      name: "New Mexico",
    };
  } else if (code >= 10000 && code <= 14999) {
    state = {
      abbr: "NY",
      name: "New York",
    };
  } else if (code >= 43000 && code <= 45999) {
    state = {
      abbr: "OH",
      name: "Ohio",
    };
  } else if (code >= 73000 && code <= 74999) {
    state = {
      abbr: "OK",
      name: "Oklahoma",
    };
  } else if (code >= 97000 && code <= 97999) {
    state = {
      abbr: "OR",
      name: "Oregon",
    };
  } else if (code >= 15000 && code <= 19699) {
    state = {
      abbr: "PA",
      name: "Pennsylvania",
    };
  } else if (code >= 300 && code <= 999) {
    state = {
      abbr: "PR",
      name: "Puerto Rico",
    };
  } else if (code >= 2800 && code <= 2999) {
    state = {
      abbr: "RI",
      name: "Rhode Island",
    };
  } else if (code >= 29000 && code <= 29999) {
    state = {
      abbr: "SC",
      name: "South Carolina",
    };
  } else if (code >= 57000 && code <= 57999) {
    state = {
      abbr: "SD",
      name: "South Dakota",
    };
  } else if (code >= 37000 && code <= 38599) {
    state = {
      abbr: "TN",
      name: "Tennessee",
    };
  } else if (
    (code >= 75000 && code <= 79999) ||
    (code >= 88500 && code <= 88599)
  ) {
    state = {
      abbr: "TX",
      name: "Texas",
    };
  } else if (code >= 84000 && code <= 84999) {
    state = {
      abbr: "UT",
      name: "Utah",
    };
  } else if (code >= 5000 && code <= 5999) {
    state = {
      abbr: "VT",
      name: "Vermont",
    };
  } else if (code >= 22000 && code <= 24699) {
    state = {
      abbr: "VA",
      name: "Virgina",
    };
  } else if (code >= 20000 && code <= 20599) {
    state = {
      abbr: "DC",
      name: "Washington DC",
    };
  } else if (code >= 98000 && code <= 99499) {
    state = {
      abbr: "WA",
      name: "Washington",
    };
  } else if (code >= 24700 && code <= 26999) {
    state = {
      abbr: "WV",
      name: "West Virginia",
    };
  } else if (code >= 53000 && code <= 54999) {
    state = {
      abbr: "WI",
      name: "Wisconsin",
    };
  } else if (code >= 82000 && code <= 83199) {
    state = {
      abbr: "WY",
      name: "Wyoming",
    };
  } else {
    state = {
      abbr: "",
      name: "",
    };
  }
  return state;
};
