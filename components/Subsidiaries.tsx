import SubsidiaryCard, { type SubsidiaryBrand } from './SubsidiaryCard';
import SectionHeader from './SectionHeader';

interface Subsidiary {
  name: string;
  logo: string;
  description: string;
  details: string;
  locations: string[];
  url?: string;
  brands?: SubsidiaryBrand[];
}

export default function Subsidiaries() {
  const subsidiaries: Subsidiary[] = [
    {
      name: "Ecosphere Trade BV",
      logo: "ET",
      description: "Delivering authentic Indian food to the EU diaspora—rice, dals, spices, pickles, and more across 8+ European countries.",
      details: "Ecosphere Trade BV imports and distributes traditional Indian groceries for communities abroad. Through ecosphere.cc and our European network, we connect farmers in India with households that want the taste of home—without compromising on quality or authenticity.",
      locations: ["Netherlands", "European Union"],
      url: "https://ecosphere.cc/",
      brands: [
        {
          name: "Balaji",
          image: "/brands/balaji.png",
          description: "The taste of home—authentic Indian rice, lentils, spices, pickles, and masalas across Europe.",
          details:
            "Balaji delivers traditionally grown products sourced from farmers across Indian states, distributed in 8+ European countries. From Sona Masuri rice and dals to masalas and condiments, every product is packed with quality assurance and the nostalgic flavours diaspora families remember.",
          url: "https://balaji.nl/",
        },
        {
          name: "OFBJP Netherlands",
          image: "/brands/ofbjp.png",
          description: "Overseas Friends of BJP—uniting the Indian-Dutch community through seva, culture, and civic engagement since 2015.",
          details:
            "OFBJP Netherlands is a non-profit, volunteer-led foundation bridging Indian and Dutch communities. With 120+ events organised, a free community helpdesk, and representation to municipalities and parliamentarians, OFBJP serves PIO, OCI, and NRI families with unity in diversity.",
          url: "https://ofbjpnetherlands.org/",
        },
      ],
    },
    {
      name: "Shri Sai Ram Financials Cooperatie",
      logo: "SF",
      description: "A communal investment into startups, scaleups in India, Netherlands, Switzerland.",
      details: "Shri Sai Ram Financials Cooperatie is a community-focused investment cooperative that pools resources to support promising startups and scale-ups. We provide not just capital but also strategic guidance and networking opportunities to help businesses grow.",
      locations: ["India", "Netherlands", "Switzerland"]
    },
    {
      name: "Where the Alps Meet the Vedas",
      logo: "AV",
      description: "An Alpine ashram for the modern seeker—yoga, Ayurveda, and sattvic living at the foot of sacred mountains.",
      details: "A Hindu-rooted retreat in the Italian Alps offering daily sadhana, sattvic cuisine, farm and equine therapy, and seasonal programs aligned with Ayurvedic ritucharya. Guests experience authentic spiritual practice where Alpine beauty meets Sanātana Dharma.",
      locations: ["Italian Alps", "Switzerland"],
      url: "https://brink-trick-47383861.figma.site/"
    },
    {
      name: "Emanate",
      logo: "EM",
      description: "A company providing solutions in Data, AI, ERP across Finance, Government and Healthcare industries.",
      details: "Emanate delivers comprehensive data, AI, and ERP solutions tailored for finance, government, and healthcare sectors. Our expertise lies in transforming complex data into actionable insights and implementing robust enterprise systems that drive efficiency and innovation.",
      locations: ["Netherlands", "Switzerland", "Zambia"]
    },
    {
      name: "Sanātana Dharma Way",
      logo: "SD",
      description: "An interactive learning guide to Sanātana Dharma for study, practice, and daily life.",
      details: "Sanātana Dharma Way maps this tradition as a connected landscape—structured knowledge regions, topic pages, and references designed to help people learn and apply teachings in real life, not only collect information.",
      locations: ["European Union"],
      url: "https://sanatanadharmaway.eu/"
    },
    {
      name: "Dutch Caution",
      logo: "DC",
      description: "Security and risk management providing comprehensive safety solutions and consultancy across Europe.",
      details: "Dutch Caution delivers security and risk management services for organizations that need practical safety solutions, risk assessment, and consultancy tailored to European operating environments.",
      locations: ["Netherlands", "European Union"]
    }
  ];

  return (
    <section id="subsidiaries" className="relative py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        <SectionHeader
          hindiTitle="उपकंपनियाँ"
          title="Our Subsidiaries"
          subtitle="Discover our diverse portfolio of companies operating across multiple industries and regions"
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subsidiaries.map((subsidiary, index) => (
            <SubsidiaryCard
              key={subsidiary.name}
              name={subsidiary.name}
              logo={subsidiary.logo}
              description={subsidiary.description}
              details={subsidiary.details}
              locations={subsidiary.locations}
              url={subsidiary.url}
              brands={subsidiary.brands}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
}