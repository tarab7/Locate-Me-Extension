import { useEffect, useState } from "react"
import "./style.css";
import { codes } from "~country_codes";
import LocationOnIcon from '@mui/icons-material/LocationOn';

function IndexPopup() {
  const [ipaddress, setIpaddress] = useState(null);
  const [loading, setLoading] = useState(false);
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("");

  //Taking IP Address using UseEffect
  useEffect(() => {
    const getIP = async () => {
      try {
        let result = await fetch("https://api.ipify.org?format=json", {
          method: "GET"
        });

        if (!result.ok) {
          throw new Error("Network response was not ok");
        }

        const data = await result.json();
        setIpaddress(data.ip);
      } catch (error) {
        console.log(error);
      }
    };
    getIP();
  }, [ipaddress])

  //Finding location using API on clicking of button.
  const findLocation = async () => {
    try {
      setLoading(true);
      const response = await fetch(`https://ipinfo.io/${ipaddress}?token=${process.env.PLASMO_PUBLIC_IPINFO_TOKEN}`, {
        method: "GET"
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      setCity(result.city);
      setCountry(codes[result.country]);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        padding: "30px",
        height: "500px",
        width: "500px",
        backgroundImage: `url('https://cdn.pixabay.com/photo/2012/01/09/09/59/earth-11595_1280.jpg')`,
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}>

      <div className='h-full w-full justify-center border-2 border-white-500/100 rounded-lg flex justify-center items-center relative'>

        <div className="w-full h-52 flex justify-center items-center">
          <div className="flex flex-col justify-center items-center">

            {
              city != "" && country != "" ?
                <div className="flex absolute" style={{top:"90px", right:"120px"}}>
                  <span className="py-2 px-2 my-3  "><LocationOnIcon className="text-red-600 h-full w-full" /></span>
                  <h3 className="py-2 px-2 bg-slate-600 bg-opacity-50 my-3 text-white text-xl">Your country is {country} <br/>and city is {city}</h3>
                </div> :
                null
            }
            {loading ? <button className="bg-indigo-500 shadow-lg shadow-indigo-500/50 border-2 border-sky-500 rounded-md hover:bg-blue-800 text-white py-3 px-3 font-semibold0">Loading...</button> :
              <button className="bg-indigo-500 shadow-lg shadow-indigo-500/50 border-2 border-sky-500 rounded-md hover:bg-blue-800 text-white py-3 px-3 font-semibold" onClick={findLocation}>Show my Location</button>}
          </div>

        </div>


      </div>

    </div>

  )
}


export default IndexPopup
