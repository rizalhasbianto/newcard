export const companySample = [
    {
      name: 'Company Name',
      location: {
        address: "address 1",
        city: "city 1",
        state: "state 1",
        zip: "zip 1",
      },
      avatar: 'file url',
      contact: {
        phone: "+18373434737",
        email: "sample@gmail.com",
      },
      shipTo: [
        {
            locationName: "wareHouse 3",
            location: {
                address: "address 1",
                city: "city 1",
                state: "state 1",
                zip: "zip 1",
            },
            default: "yes"
        },
        {
            locationName: "office 4",
            location: {
                address: "address 2",
                city: "city 2",
                state: "state 2",
                zip: "zip 2",
            },
        }
      ]
    },
    {
        name: 'Company test 2',
        location: {
          address: "address 2",
          city: "city 2",
          state: "state 2",
          zip: "zip 2",
        },
        avatar: 'file url',
        contact: {
          phone: "+18373434737",
          email: "sample@gmail.com",
        },
        shipTo: [
          {
              locationName: "wareHouse",
              location: {
                  address: "address 3",
                  city: "city 3",
                  state: "state 3",
                  zip: "zip 3",
              },
              default: "yes"
          },
          {
              locationName: "office",
              location: {
                  address: "address 4",
                  city: "city 4",
                  state: "state 4",
                  zip: "zip 4",
              },
          }
        ]
      },
  ]