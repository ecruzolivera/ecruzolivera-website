export const siteMetadata = {
  title: `Ernesto's site`,
  description: `Ernesto Cruz Olivera's personal Website`,
  author: `Ernesto Cruz Olivera`,
  siteUrl: `https://ecruzolivera.vercel.app/`,
  keywords: [
    `personal`,
    `blog`,
    `C`,
    `C/C++`,
    `Qt`,
    `QML`,
    `embedded`,
    `microcontrollers`,
    `Real Time`,
    `State Machines`,
    `ReactJs`,
    `Javascript`,
  ],
};

export const socialLinks = [
  {
    icon: "fab fa-github",
    to: `https://github.com/ecruzolivera`,
    label: "Contact me on github",
  },
  {
    icon: "fab fa-gitlab",
    to: `https://gitlab.com/ecruzolivera`,
    label: "My gitlab repositories",
  },
  {
    icon: "fab fa-linkedin",
    to: `https://www.linkedin.com/in/ecruzolivera`,
    label: "Contact me on linkedin",
  },
  {
    icon: "fas fa-envelope",
    to: `mailto:ecruzolivera@gmail.com?subject=Reaching%20Out&body=How%20are%20you`,
    label: "Contact me via email",
  },
  {
    icon: "fas fa-rss",
    to: `${siteMetadata.siteUrl}/rss.xml`,
    label: "RSS feed",
  },
];

export const cv = {
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
};
