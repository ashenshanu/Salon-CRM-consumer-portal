import Link from 'next/link';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Button from '@/components/ui/Button';

export default function HomePage() {
  return (
    <>
      <Header />
      <main className="flex-1">
        {/* Hero */}
        <section className="bg-white border-b border-stone-100">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-20 sm:py-28 text-center">
            <p className="text-sm font-medium tracking-widest uppercase text-stone-400 mb-4">
              Welcome to
            </p>
            <h1 className="text-4xl sm:text-6xl font-bold text-stone-900 tracking-tight mb-6">
              Ashen Salon
            </h1>
            <p className="text-lg sm:text-xl text-stone-500 max-w-xl mx-auto mb-10">
              Professional hair and beauty services. Book your appointment online in minutes.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/book">
                <Button size="lg">Book an Appointment</Button>
              </Link>
              <Link href="/sign-up">
                <Button variant="secondary" size="lg">Create an Account</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features */}
        <section className="mx-auto max-w-5xl px-4 sm:px-6 py-16 sm:py-24">
          <div className="grid sm:grid-cols-3 gap-8">
            {[
              {
                icon: '✦',
                title: 'Easy Online Booking',
                description: 'Book any service in just a few clicks — no phone calls needed.',
              },
              {
                icon: '✧',
                title: 'Choose Your Stylist',
                description: 'Pick your preferred stylist or let us recommend the best match.',
              },
              {
                icon: '◇',
                title: 'Loyalty Rewards',
                description: 'Earn points with every visit and enjoy exclusive member benefits.',
              },
            ].map((feature) => (
              <div key={feature.title} className="text-center">
                <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-stone-100 text-stone-700 text-xl mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-base font-semibold text-stone-900 mb-2">{feature.title}</h3>
                <p className="text-sm text-stone-500 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-stone-900 text-white">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 py-14 sm:py-20 text-center">
            <h2 className="text-2xl sm:text-3xl font-bold mb-4">Ready for your next appointment?</h2>
            <p className="text-stone-400 mb-8">Join hundreds of happy clients who book with us every week.</p>
            <Link href="/book">
              <Button variant="secondary" size="lg">Book Now</Button>
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
