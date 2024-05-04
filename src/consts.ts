// Place any global data in this file.
// You can import this data from anywhere in your site by using the `import` keyword.

const cv = {
  education: [
    {
      start_date: "2017",
      end_date: "2018",
      title: "Master in Electronic Systems Engineering",
      place: "UC3M Campus Leganés",
      city: "Madrid",
      country: "Spain",
    },
    {
      start_date: "2006",
      end_date: "2011",
      title: "Engineering in Telecommunications and Electronics",
      place: "Technological University of Havana ",
      city: "Havana",
      country: "Cuba",
    },
  ],
  jobs: [
    {
      start_date: "2020",
      end_date: "Current",
      title: "Embedded Software Engineer",
      place: "FORME Interactive Strength",
      city: "Remote",
      country: "Remote",
    },
    {
      start_date: "2019",
      end_date: "2020",
      title: "Embedded Software Engineer",
      place: "Wipro Technologies",
      city: "Queretaro",
      country: "Mexico",
    },
    {
      start_date: "2011",
      end_date: "2017",
      title: "Embedded Systems Engineer",
      place: "Cuban Neuroscience Center",
      city: "Havana",
      country: "Cuba",
    },
  ],
}

const username = "ecruzolivera"

export const SOCIAL_LINKS = [
  {
    icon: "fab fa-github",
    to: `https://github.com/${username}`,
    label: "Contact me on github",
  },
  {
    icon: "fab fa-gitlab",
    to: `https://gitlab.com/${username}`,
    label: "My gitlab repositories",
  },
  {
    icon: "fab fa-linkedin",
    to: `https://www.linkedin.com/in/${username}`,
    label: "Contact me on linkedin",
  },
]

export const SITE_TITLE = "Ernesto's Blog"
export const SITE_DESCRIPTION = "Every now and then i post something"
