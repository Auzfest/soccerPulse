import Header from "../components/header";
import Footer from "../components/footer";

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto p-6 my-10 text-center mb-64">
        <h1 className="text-3xl font-bold mb-8">About</h1>
        <p className="text-lg mb-16">
          This is a one-man personal project, and I'm proud to say that I've built
          it from scratch. I'm a huge soccer fan and I wanted to create an app
          that would allow me to easily follow my favorite teams and leagues.
        </p>
        <p className="text-lg mb-16">
          If you have any suggestions or find any bugs, please don't hesitate to
          contact me at <a href="mailto:barnesfamilyaustin@gmail.com">barnesfamilyaustin@gmail.com</a>.
        </p>
      </div>
      <Footer />
    </div>
  );
}
