import { getProviders, signIn } from "next-auth/react";

function Login({ providers }) {
  return (
    <div className="flex flex-col items-center bg-black min-h-screen w-full justify-center">
      <img
        height="208px"
        width="208px"
        classname="w-52 h-52px mb-5"
        src="https://spotlightstudio.org/wp-content/uploads/2019/12/image-gallery-spotify-logo-21.png"
      ></img>
      {Object.values(providers).map((provider) => {
        return (
          <div key={provider.name}>
            <button
              className="bg-[#18D860] text-white p-5 rounded-full"
              onClick={() => signIn(provider.id, { calbackUrl: "/" })}
            >
              Login with {provider.name}
            </button>
          </div>
        );
      })}
    </div>
  );
}

export default Login;

// returning server side rendered page
export async function getServerSideProps(context) {
  const providers = await getProviders();
  return {
    props: {
      providers,
    },
  };
}
