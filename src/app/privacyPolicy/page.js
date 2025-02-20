import Header from "../components/header";
import Footer from "../components/footer";

const PrivacyPolicyPage = () => {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-xl">
          <h1 className="text-2xl font-bold text-center text-gray-800">
            Privacy Policy
          </h1>
          <p className="mt-4">
            At Soccer Pulse, we take the privacy of our users very seriously. We
            only collect information that is necessary for the proper functioning
            of our website and services. We do not sell or share any of your
            information with third parties, and we do not use it for any
            advertising purposes.
          </p>
          <p className="mt-4">
            We may use your information to contact you about your account, or to
            provide you with information about our services. We may also use it to
            personalize your experience on our website and to improve our
            services.
          </p>
          <p className="mt-4">
            We use cookies to store information about your preferences and to
            record user-specific information on which pages the user access or
            visit, and to customize Web page content based on visitors browser
            type or other information that the visitor sends via their browser.
          </p>
          <p className="mt-4">
            If you have any questions or concerns about our privacy policy, or if
            you would like to request that we delete any of your information,
            please contact us
            <a href="mailto:barnesfamilyaustin@gmail.com">here</a>.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage;
