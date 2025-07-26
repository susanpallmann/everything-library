const vocabulary = {
  nouns: {
    // Abstract nouns are things that can't be sensed. They denote ideas, measurements, emotions, or qualities (e.g., "existentialism", "democracy", "evil")
    abstract: {
      // Proper nouns identify specific ideas. Proper nouns are typically capitalized (e.g., "Christianity", "Marxism")
      proper : {
        // It is going to be harder to tell the plurality of abstract nouns as it is not dependent on which noun, but rather how it is used
        abstractPlurality: {
        }
      },
      // Common nouns identify classes or types of things, and usually aren't capitalized (e.g., "philosophy", "humor")
      common: {
        // It is going to be harder to tell the plurality of abstract nouns as it is not dependent on which noun, but rather how it is used
        abstractPlurality: {
        }
      }
    },
    // Concrete nouns name persons, places, and things that can be detected by senses (e.g., "parents", "beach", "houseplants")
    concrete: {
      // Proper nouns identify specific people, places, or things. Proper nouns are typically capitalized (e.g., "Susan", "Zion National Park")
      proper: {
        // Nouns that can have their plurality assessed based on common patterns and exceptions
        conventionalPlurality: {
          time: {
            months: {
              'January': true, 'February': true, 'March': true, 'April': true, 'May': true, 
              'June': true, 'July': true, 'August': true, 'September': true, 'October': true, 
              'November': true, 'December': true
            },
            daysOfTheWeek: {
              'Sunday': true, 'Monday': true, 'Tuesday': true, 'Wednesday': true, 'Thursday': true, 
              'Friday': true, 'Saturday': true
            },
          },
          place: {
            countries: {
              unitedStates: {'United States of America': true, 'USA': true, 'United States': true}
            },
            USStates: {
              'Alabama': true, 'Alaska': true, 'Arizona': true, 'Arkansas': true, 'California': true, 
              'Colorado': true, 'Connecticut': true, 'Delaware': true, 'Florida': true, 'Georgia': true, 
              'Hawaii': true, 'Idaho': true, 'Illinois': true, 'Indiana': true, 'Iowa': true, 
              'Kansas': true, 'Kentucky': true, 'Louisiana': true, 'Maine': true, 'Maryland': true, 
              'Massachusetts': true, 'Michigan': true, 'Minnesota': true, 'Mississippi': true, 'Missouri': true, 
              'Montana': true, 'Nebraska': true, 'Nevada': true, 'New Hampshire': true, 'New Jersey': true, 
              'New Mexico': true, 'New York': true, 'North Carolina': true, 'North Dakota': true, 'Ohio': true, 
              'Oklahoma': true, 'Oregon': true, 'Pennsylvania': true, 'Rhode Island': true, 'South Carolina': true, 
              'South Dakota': true, 'Tennessee': true, 'Texas': true, 'Utah': true, 'Vermont': true, 
              'Virginia': true, 'Washington': true, 'West Virginia': true, 'Wisconsin': true, 'Wyoming': true
            }
          }
        },
        // Nouns that denote groups. These may describe a large group of people or things (e.g., "army"), but may be treated as a singular noun regardless (e.g. "the army is moving inland")
        collectivePlurality: {
        }
      },
      // Common nouns identify classes or types of things, and usually aren't capitalized (e.g., "dogs", "parks", "people")
      common: {
        // Nouns that can have their plurality assessed based on common patterns and exceptions
        conventionalPlurality: {
        },
        // Nouns that denote groups. These may describe a large group of people or things (e.g., "army"), but may be treated as a singular noun regardless (e.g. "the army is moving inland")
        collectivePlurality: {
        }
      }
    }
  }
};
