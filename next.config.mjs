/** @type {import('next').NextConfig} */
const nextConfig = {
      logging:{
        fetches:{
          fullUrl:true
        }
      },
      async redirects() {
        return [
          {
            source: '/',
            destination:process.env.DEFAULT_LOGIN_REDIRECT,
            permanent: true,
          },  
        ]
      },

};

export default nextConfig;
