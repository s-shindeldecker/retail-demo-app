import { useFlags } from "launchdarkly-react-client-sdk";


const Promotion = () => {
    const { promoBannerText } = useFlags();
    return (
        <section className="py-2 gap-10 mx-3 bg-gray-100">
            <p className="mt-2 justify-center text-center text-gray-700 underline">
                {promoBannerText}
            </p>
        </section>
    );
};

export default Promotion;
