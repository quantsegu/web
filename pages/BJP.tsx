import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import BJPInformation from '../components/BJPInformation';

export default function BJP() {
  return (
    <div className="min-h-screen w-full bg-[#050108]">
      <Navbar />
      <main className="pt-16">
        <BJPInformation />
      </main>
      <Footer />
    </div>
  );
}
