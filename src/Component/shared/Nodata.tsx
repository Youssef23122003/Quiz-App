import nodata from "../../assets/nodata-BviNkmy5.jpg";

export default function Nodata() {
  return (
    <div className="flex flex-col items-center justify-center py-10">
      
      <img
        src={nodata}
        alt="No Data"
        className="w-60 h-60 object-contain mb-6 opacity-80"
      />

      
      <h2 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-2">
        No Data Available
      </h2>
      <p className="text-gray-500 text-center max-w-md">
        There’s nothing to show here right now. Please check back later.
      </p>
    </div>
  );
}

