import React, { useState } from "react";
import { FaGithub } from "react-icons/fa";
import "../App.css";
import { logos } from "../assets/logos";

const linkButtonStyle = {
  display: "inline-flex",
  alignItems: "center",
  gap: "8px",
  padding: "10px 16px",
  textDecoration: "none",
  color: "#d4d7e4",
  border: "1px solid #ccc",
  borderRadius: "4px",
  cursor: "pointer",
};

const jobs = [
  {
    id: 15,
    company: "Mainspring Energy",
    logo: logos.mainspringenergy,
    url: "https://www.mainspringenergy.com/",
    title: "Software Engineer",
    department: "Software and Controls",
    startDate: "August 2021",
    endDate: "present",
    description: `I joined Mainspring Energy to help build
      a new generation of distributed energy resources.
      I developed the Linear Generator Power Panel (LPP),
      a web-based interface used by the operator to control
      the generator control system.
      I also develop and maintain telemetry monitoring tools to track
      and report on generator performance and reliability.
      I also support and troubleshoot field operations and work with
      controls engineers to implement new features and
      update troubleshooting documentation.
        `,
    details: [
      `Developed the Linear Generator Power Panel (LPP),
      the OFF button, used by the operator to remotely start the 
      50 minute shutdown/cool down process of the generator
      for maintenance using web browser on a smartphone.
      I work with controls engineers to implement new features and
      fix bugs in the LPP and the generator control system.`,
      `Develop and maintain telemetry monitoring tools to track
      and report on generator performance and reliability.
      These include Jupyter Lab and Hex notebooks.`,
      `Update and maintain the gateway telemetry system,
      adding new signals to our BigQuery database and deploy
      the updates with terraform to our GCE cloud services.`,
      `Built and maintain a Python BigQuery loader tool to 
      backfill missing streaming data from locally stored generator
      gateway telemetry files.`,
      `Support and troubleshoot field operations and work with
      controls engineers to implement new features and
      update troubleshooting documentation.`,
      `Developed a process for using AI (Claude) to analyze
      weeks of syslogs to find new insights into the root cause of
      problems and reporting that in Jira.`,
    ],
  },
  {
    id: 14,
    company: "Lokker",
    logo: logos.lokker,
    url: "https://www.lokker.com/",
    title: "Senior Engineer",
    department: "Engineering",
    startDate: "November 2020",
    endDate: "April 2021",
    description: `At Lokker I created a Python
      scanner to collect and analyze network data,
      developed a configuration server to manage scanner
      settings and updates and setup Okta authentication
      for our web application.`,
    details: [
      `Rapid Prototype Deployment: Built a containerized
        Go-based product integrating a Fluent Bit Golang
        plugin template with Google BigTable in Docker.`,
      `Architected Microservices: Designed and deployed
        lightweight Alpine-Python Docker containers
        running Flask servers; engineered a Redis-backed
        configuration server to maintain web tracking
        data and a Postgres-monitoring API to serve
        real-time configuration updates.`,
      `Integrated Authentication & Marketing Automation:
        Added Okta integration to the core scanner
        product to secure routes via OAuth2. Integrated
        Salesforce APIs using JavaScript (Axios) to
        automate new account notifications and scale user
        email communications via marketing templates.`,
      `Data Normalization: Authored a JavaScript class
        to ingest, parse, and normalize inconsistent
        WHOIS data from various sources.`,
    ],
  },
  {
    id: 13,
    company: "vArmour",
    logo: logos.varmour,
    url: (
      "https://www.cybersecurityintelligence.com/" +
      "varmour-2426.html"
    ),
    title: "Sr. Development Engineer",
    department: "CTO Organization",
    startDate: "February 2017",
    endDate: "November 2020",
    description: `At vArmour I worked on developing and
      maintaining our core security scanning product. I
      created Python DSS clients and developed
      comprehensive testing frameworks.`,
    details: [
      `Containerized Network Testing: Developed
        "Squawker," an Alpine-Python Flask server
        framework deployed across containers and CentOS
        VMs to simulate and test micro-segmentation on
        distributed container networks across multiple
        protocols (HTTP, SFTP, iPerf3).`,
      `Automated System Testing: Created a
        Python pip package of RESTful API clients
        combined with pytest to orchestrate end-to-end
        system testing, policy enforcement validation,
        and automated environment cleanup.`,
      `Performance Benchmarking: Integrated
        pytest-benchmarks to measure and record
        performance for a number of test configurations,
        ensuring optimal system behavior under various
        load scenarios.`,
      `Technical Leadership & Documentation: Authored
        comprehensive developer setup guides and
        foundational customer-facing technical
        documentation while mentoring interns and
        conducting code reviews.`,
    ],
  },
  {
    id: 12,
    company: "SilverTail Systems",
    logo: logos.silver_tail_systems,
    url: (
      "https://archive.nytimes.com/bits.blogs.nytimes" +
      ".com/2012/10/30/emc-acquires-silver-tail-systems/"
    ),
    title: "Principal Software Engineer",
    department: "Research and Development",
    startDate: "November 2011",
    endDate: "January 2017",
    description: `At SilverTail Systems I created Python
      scripts to parse priority log formats into
      structured data and developed CI/CD pipeline
      automation tools.`,
    details: [
      `Network Data Analysis: Built a suite of pytest
       tools utilizing scapy and Wireshark to
        synthesize network traffic from HTML logs and
        PCAP outputs, providing test data to validate
        scoring algorithms and measure system limits.`,
      `Threat Research & Database Engineering: Parsed
        complex priority log formats into structured data
        for insertion into Postgres (relational) and
        MongoDB (NoSQL) databases.`,
      `CI/CD Pipeline Automation: Designed and
        implemented "Captain Hook," a continuous
        integration manager built on the Tornado
        framework with GitHub Webhooks and Jenkins to
        build and test code as part of the development
        process.`,
    ],
  },
  {
    id: 11,
    company: "CDNetworks",
    logo: logos.cdnetworks,
    url: "http://www.us.cdnetworks.com",
    title: "Sr. Software Engineer",
    department: "Back-end Infrastructure",
    startDate: "April 2011",
    endDate: "November 2011",
    description: `At CDNetworks I created Python daemons
      for backend infrastructure and authored an
      object-oriented DNS bind parser to support the
      zone transfer product.`,
    details: [
      `Engineered Backend Infrastructure: Developed
        multiple Python daemons and a core library to
        support backend infrastructure, including an
        automated daily customer usage calculator for
        billing utilities.`,
      `Architected Object-Oriented DNS Parsers: Authored
        an object-oriented DNS bind parser to support the
        zone transfer product, integrating it with the
        relational database via Django models.`,
      `Developed High-Performance Log Parsers: Built a
        Python daemon using the multiprocessing module to
        parse large log files into a Round Robin Database
        (RRDTool).`,
      `Created Data Delivery Microservices: Designed a
        lightweight, threaded Python HTTP server and
        daemon to generate and serve JSON payload data
        required for GUI visualization; authored
        synthetic data generation scripts to benchmark
        pipeline input performance.`,
      `Standardized Engineering Practices: Created the
        CDNetworks Python Style Guide (extending PEP 8).`,
    ],
  },
  {
    id: 10,
    company: "IronPort Systems",
    logo: logos.ironport,
    url: (
      "https://www.cisco.com/c/en/us/services/" +
      "acquisitions/ironport.html"
    ),
    title: "Software Engineer",
    department: "Security Applications",
    startDate: "April 2005",
    endDate: "April 2011",
    description: `At IronPort I worked on the development
      of our Sender Base Reputation Service (SBRS)
      product, a DNS service used by our email
      appliances. I also worked on our "corpus", a
      database of spam for use with the IronPort
      Anti-Spam (IPAS) tool.`,
    details: [
      `Algorithmic Optimization: Implemented a
        Python rule weight evaluation utility that
        applied a gradient descent algorithm to telemetry
        ("phone home") data, successfully determining the
        optimal set of rule weights to maximize detection
        efficacy.`,
      `Product Development & Execution: Led the
        end-to-end development of the third generation of
        the Web-Based Reputation Service (WBRS) for web
        appliances, as well as the 2.0 release of the
        Sender Base Reputation Service (SBRS), a
        high-throughput DNS service used by email
        appliances.`,
      `Tooling & Data Pipeline Engineering: Authored a
        comprehensive toolkit of Python and MySQL scripts
        to automate the generation, efficacy testing, and
        debugging of global reputation data updates.`,
      `Codebase Refactoring: Surveyed
        and refactored the legacy SBRS code tree ahead of
        its 2.0 release, pruning redundant code paths to
        reduce total line count by 60% while preserving
        underlying MySQL schemas to minimize production
        risk.`,
      `Distributed System Engineering: Created a suite
        of rc.subr daemons using Python to ingest incoming
        email from spam traps, orchestrate real-time
        engine scanning, and extract normalized metadata
        for storage in the centralized threat corpus
        database.`,
      `Global Team: Led the development effort
        to update the Spam database, Corpus 2.0,
        project, a distributed system of MySQL servers
        and Python daemons that collected, processed, and
        stored spam data from a global network of
        distributed email traps.`,
      `Technical Documentation: Supported the
        development team and customer success teams
        by authoring functional
        specifications, onboarding guides, and user
        manuals.`,
      `Standardization: Authored
        foundational functional and design
        specifications and system
        administration guides.`,
        `Worked with QA to build advanced performance-monitoring and
        validation tools.`,
    ],
  },
  {
    id: 9,
    company: "The QSS Group",
    logo: logos.nasa,
    url: (
      "https://www.dnb.com/business-directory/" +
      "company-profiles.qss_group_inc." +
      "d6c25b6d9e46251a136df56d693f1ac8.html"
    ),
    title: "Sr. Software Engineer",
    department: "Information Physics Group",
    startDate: "September 2003",
    endDate: "March 2005",
    description: `At QSS I worked on the CSFSR and SPEAD
      projects for NASA. The CSFSR project was a C++ test
      framework that was used to look for the optimal
      solution to the most likely mix of gases seen in a
      high spectral resolution satellite image of the
      earth's surface. The SPEAD project was a Qt-based
      tool kit for signal processing.`,
    details: [
      `Scientific Framework Engineering: Implemented the
        CSFSR (Classification of Spectral Features in the
        Solar Radiation) computational testing framework
        in C++ to analyze high-spectral-resolution
        satellite imagery of the Earth's surface.`,
      `Algorithmic Optimization: Worked with atmospheric
        physicists to translate complex radiation
        equations into production code; experimented with
        simulated annealing and gradient descent
        optimization techniques to isolate the most likely
        atmospheric gas mixtures (O3, O2, CO2, NO2, and
        H2O).`,
      `Cross-Language Integration: Engineered native C++
        wrappers for legacy Fortran DISORT functions,
        eliminating text-parsing overhead from standard
        outputs and significantly accelerating image
        processing pipelines.`,
      `Signal Processing Simulation: Extended the SPEAD
        (Signal Processing Environment for Application
        Development) toolkit using the Qt framework,
        developing modular simulators for signal
        generators, mixers, spectrum analyzers, and
        oscilloscopes.`,
      `Build System Automation: Designed a custom qmake
        file-builder language paired with a Python
        automation script to programmatically generate
        complex cross-platform Makefiles required for Qt
        compilation.`,
      `Model Validation: Built robust testing harnesses
        to continuously validate the accuracy,
        mathematical boundaries, and fidelity of the core
        remote sensing models.`,
    ],
  },
  {
    id: 8,
    company: "SETI Institute",
    logo: logos.seti_mk2,
    url: "https://www.seti.org/",
    title: "Sr. Software Engineer",
    department: "The Phoenix Group",
    startDate: "August 2000",
    endDate: "August 2003",
    description: `At the SETI Institute I worked on the
      Project Phoenix program, a NASA-funded initiative
      to search for extraterrestrial intelligence. I
      developed software to control the SETI Institute's
      radio telescopes and process the resulting data.`,
    details: [
      `Distributed Systems Architecture: Engineered
        components for Project Phoenix's Search System
        Executive (SSE) within the New Search System
        (NSS), continuing the NASA-initiated program to
        observe targeted star systems within 200
        light-years for extraterrestrial radio
        signatures.`,
      `Telescope Control Engineering: Developed low-level
        and high-level control interface applications to
        orchestrate hardware automation, telescope
        positioning, and real-time data acquisition from
        deep-space radio telescopes.`,
      `Data Pipeline & Database Design: Authored data
        ingestion pipelines and optimized relational
        database schemas to efficiently capture, store,
        catalog, and query massive observation event
        results.`,
      `System Integration: Worked with
        astronomers and hardware engineers to translate
        complex scientific observation criteria into
        reliable, fault-tolerant software systems.`,
    ],
  },
  {
    id: 7,
    company: "Sequence Design",
    logo: logos.sequence_design,
    url: (
      "https://semiengineering.com/entities/" +
      "sequence-design/"
    ),
    title: "Sr. Software Engineer",
    department: "Engineering",
    startDate: "August 1998",
    endDate: "August 2000",
    description: `At Sequence Design I worked on the
      Columbus project, a software tool used to model the
      behavior of parasitic capacitance from the
      interconnect circuits in an integrated circuit
      design.`,
    details: [
      `Cross-Platform Architecture: Performed the
        multi-platform migration and porting of the core
        Columbus source code base from Solaris to the
        HPUX and IRIX operating systems.`,
      `Build System Optimization: Updated the legacy
        compilation infrastructure by integrating Rogue
        Wave's implementation of the C++ Standard Template
        Library (STL), increasing build reliability and
        performance.`,
      `Parasitic Extraction Modeling: Contributed to the
        development and enhancement of the Columbus
        product, a highly specialized tool designed to
        calculate and generate SPICE models for parasitic
        capacitance within integrated circuit interconnect
        lines.`,
      `Code Cleanup & Modernization: Refactored legacy
        code trees to resolve dependency
        conflicts, establishing standardized compilation
        patterns across three distinct UNIX-based
        operating systems.`,
    ],
  },
  {
    id: 6,
    company: "OpenEye Scientific Software",
    logo: logos.openeye,
    url: "https://www.eyesopen.com/",
    title: "Contractor",
    department: "Software Development",
    startDate: "July 1996",
    endDate: "August 1996",
    description: `I created a flex/bison parser to read and
      write a proprietary molecular file format.`,
    details: [
      `Compiler & Parser Engineering: Created a robust,
        deterministic syntax parser utilizing Flex and
        Bison (lex/yacc) to read, validate, and write a
        proprietary molecular file format.`,
      `Format Standardization: Developed abstract syntax
        trees and structural token rules to normalize
        chemical data inputs, ensuring strict compliance
        with underlying modeling constraints.`,
    ],
  },
  {
    id: 5,
    company: "Cadence Design",
    logo: logos.cadence,
    url: "https://www.cadence.com/en_US/home.html",
    title: "Member of Consulting Staff",
    department: "Multimedia Group",
    startDate: "October 1996",
    endDate: "June 1998",
    description: `At Cadence Design I worked on the Signal
      Processing Workbench (SPW) product suite, a
      graphical modeling tool used to design and simulate
      complex signal processing systems. I developed
      modular C++ components and provided technical
      support.`,
    details: [
      `Object-Oriented Module Engineering: Developed
        modular, high-performance C++ components for the
        Signal Processing Workbench (SPW) product suite,
        enabling advanced graphical modeling of complex
        signal processing systems.`,
      `System Integration: Provided
        critical technical support and targeted deployment
        troubleshooting to enterprise customers installing
        and executing newly released software modules.`,
      `Technical Documentation: Authored installation
        guides, release notes, and functional user
        documentation to streamline module integration and
        reduce support overhead.`,
    ],
  },
  {
    id: 4,
    company: "Trimble Navigation",
    logo: logos.trimble,
    url: "https://www.trimble.com/",
    title: "Member of Technical Staff III",
    department: "Land Survey",
    startDate: "August 1996",
    endDate: "October 1996",
    description: `I wrote makefiles to build the source
      code generated by Rational Rose for the TrimTalk
      communication product.`,
    details: [
      `Build Automation Engineering: Designed and
        optimized hierarchical Makefiles to automate
        compilation pipelines for the TrimTalk
        communication product codebase.`,
      `CASE Tool Integration: Programmatically integrated
        and mapped complex C++ source code generated by
        Rational Rose CASE tools into the unified,
        automated build system, reducing compilation
        bottlenecks.`,
    ],
  },
  {
    id: 3,
    company: "TIW Systems",
    logo: logos.tiwsystems,
    url: "https://www.vertexant.com/en/",
    title: "Sr. Software Engineer",
    department: "Engineering",
    startDate: "January 1994",
    endDate: "August 1996",
    description: `At TIW Systems I worked on the
      development of our satellite communications
      products. I developed software to control the
      satellite transponders and monitor their
      performance.`,
    details: [
      `Embedded Software Engineering: Developed core,
        high-performance in-orbit testing (IOT) software
        systems using C++ and Tcl on UNIX architectures
        to monitor and evaluate satellite transponder
        performance.`,
      `Global Systems Deployment: Led international
        equipment installation, system integration, and
        production verification at enterprise client
        facilities across China, Italy, Luxembourg,
        Virginia, and Wyoming.`,
      `System Integration: Worked closely
        with hardware engineering teams and international
        stakeholders to ensure rigorous field-testing
        calibration and seamless operational handoffs.`,
    ],
  },
  {
    id: 2,
    company: "Lockheed Missiles and Space Company",
    logo: logos.lockheed,
    url: "https://www.lockheedmartin.com/en-us/index.html",
    title: "Sr. Research Engineer",
    department: "Algorithm Development Group",
    startDate: "May 1986",
    endDate: "January 1994",
    description: `At Lockheed I worked on the development
      of software for signal processing. I created
      software to model the electromagnetic compatibility
      and TEMPEST characteristics of cable bundles in
      spacecraft and to process the resulting data.`,
    details: [
      `Signal Processing Modeling: Engineered an
        advanced signal processing model within the
        Algorithm Development Group to simulate, analyze,
        and demonstrate the effectiveness of various
        signal recovery techniques.`,
      `Software Modernization: Developed and maintained
        a suite of C and Fortran applications to analyze
        datasets and scale the analytical range of existing
        computational models.`,
      `Electromagnetic Compatibility Modeling: Configured
        and executed complex Fortran-based computer
        models within the Electromagnetic Compatibility
        (EMC) group to simulate and evaluate noise
        infiltration pathways in sensitive electronic
        hardware systems.`,
    ],
  },
  {
    id: 1,
    company: "Home Energy Magazine",
    logo: logos.home_energy,
    url: "http://advancedhomeenergy.com/" +
      "home-energy-magazine/",
    title: "Contributing Editor",
    department: "Editorial",
    startDate: "January 1984",
    endDate: "May 1986",
    description: `I was a contributing editor for Home
      Energy Magazine, a publication focused on energy
      conservation and renewable energy. I wrote articles
      and presented papers on energy conservation topics.`,
    details: [
      `Technical Content Strategy: Researched and
        authored comprehensive technical articles
        covering diverse methodologies and emerging
        technologies in residential energy conservation.`,
      `Publication Management: Developed the
        end-to-end production pipeline, managing
        interviews, drafting, copyediting, layout
        preparation, and distribution.`,
      `Collaboration: Worked with residential housing
        experts, building scientists, and technology
        innovators to synthesize technical data into
        accessible, authoritative industry insights.`,
    ],
  },
];

export const Resume: React.FC = () => {
  const [expandedJobs, setExpandedJobs] = (
    useState<Record<number, boolean>>({})
  );

  const toggleJob = (jobId: number) => {
    setExpandedJobs((prev) => ({
      ...prev,
      [jobId]: !prev[jobId],
    }));
  };

  const jobList = jobs.map((job) => {
    const isExpanded = !!expandedJobs[job.id];
    return (
      <div key={job.id} className="starbug-card">
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            gap: "2rem",
          }}
        >
          <div style={{ flex: 1 }}>
            <p>
              <strong>{job.company}</strong>
            </p>
            <p>{job.department}</p>
            <p>{job.title}</p>
            <p>
              {job.startDate} - {job.endDate}
            </p>
          </div>
          <div style={{ flex: 1, textAlign: "right" }}>
            <a
              href={job.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{ textDecoration: "none" }}
            >
              <img
                src={job.logo}
                alt={`${job.company} logo`}
                style={{
                  width: "140px",
                  border: "2px solid #5b84d7",
                  borderRadius: "4px",
                  flexShrink: 0,
                }}
              />
            </a>
          </div>
        </div>
        <p>{job.description}</p>
        {isExpanded && (
          <ul>
            {job.details.map((detail, id) => (
              <li key={id}>{detail}</li>
            ))}
          </ul>
        )}
        <button onClick={() => toggleJob(job.id)}>
          {isExpanded ? "Less" : "More"}
        </button>
      </div>
    );
  });

  return (
    <div className="starbug-div">
      <h1>Lincoln Randall McFarland</h1>
      <h2>Location: Mountain View, California</h2>
      <h2>Education: University of California, Berkeley. B.A. Physics, 1985</h2>

      <br />
      <div className="starbug-card">
        <p>
            I am a software engineer with over 30 years of
            experience in software development, data analysis,
            and systems engineering. I have worked on a wide
            range of projects, from developing software for
            testing spacecraft to controlling a fleet of generators.
            I have a strong background in Python, C++, and
            data analysis, and I am always looking for new
            challenges and opportunities to learn and grow.
            I have been fortunate to work on projects that
            combine my interests in physics, engineering, and
            computer science. I am excited about digging into the
            details in the data to debug problems and find solutions
            to problems that have an impact on the world.
        </p>
      </div>
      <div>
        <a
            href="https://github.com/lrmcfarland"
            target="_blank"
            rel="noopener noreferrer"
            style={linkButtonStyle}
        >
            <FaGithub color="#0A66C2" size={20} />
            <span>GitHub</span>
        </a>
      </div>
      <br />
      {jobList}
    </div>
  );
};

export default Resume;
