import React from "react";

import Layout from "../components/Layout";
import SEO from "../components/Seo";
import PlaceCard from "../components/PlaceCard";

const CV = () => {
  const data = {
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
  return (
    <Layout>
      <SEO title="CV" />
      <article className="container max-w-xl mx-auto px-2 text-justify leading-loose">
        <h1 className="text-center text-2xl font-medium leading-none mb-8">
          CV
        </h1>
        <section className="mb-4">
          <h2 className="text-xl">Job Experience:</h2>
          <ul>
            {data.jobs.map((job, index) => (
              <li key={index} className="ml-2">
                <hr className="border-b" />
                <PlaceCard place={job} />
              </li>
            ))}
          </ul>
        </section>
        <section className="mb-2">
          <h2 className="text-xl">Education:</h2>
          <ul>
            {data.education.map((job, index) => (
              <li key={index} className="ml-2">
                <hr className="border-b" />
                <PlaceCard place={job} />
              </li>
            ))}
          </ul>
        </section>
      </article>
    </Layout>
  );
};
export default CV;
