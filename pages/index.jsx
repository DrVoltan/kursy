import React, { useState } from "react";

export default function WalutyGenerator() {
  const [eurArticle, setEurArticle] = useState("");
  const [usdArticle, setUsdArticle] = useState("");
  const [loadingEur, setLoadingEur] = useState(false);
  const [loadingUsd, setLoadingUsd] = useState(false);

  const generateArticle = async (currency) => {
    if (currency === "eur") setLoadingEur(true);
    if (currency === "usd") setLoadingUsd(true);

    const res = await fetch(`/api/generate?currency=${currency}`);
    const data = await res.text();

    if (currency === "eur") {
      setEurArticle(data);
      setLoadingEur(false);
    } else {
      setUsdArticle(data);
      setLoadingUsd(false);
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold">Generator artykułów walutowych</h1>
      <div className="space-x-4">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-xl shadow"
          onClick={() => generateArticle("eur")}
          disabled={loadingEur}
        >
          {loadingEur ? "Generowanie EUR..." : "Generuj artykuł EUR/PLN"}
        </button>
        <button
          className="bg-green-600 text-white px-4 py-2 rounded-xl shadow"
          onClick={() => generateArticle("usd")}
          disabled={loadingUsd}
        >
          {loadingUsd ? "Generowanie USD..." : "Generuj artykuł USD/PLN"}
        </button>
      </div>

      {eurArticle && (
        <div>
          <h2 className="text-xl font-semibold mt-6">Artykuł EUR/PLN</h2>
          <pre className="bg-gray-100 p-4 whitespace-pre-wrap rounded-xl mt-2">{eurArticle}</pre>
        </div>
      )}

      {usdArticle && (
        <div>
          <h2 className="text-xl font-semibold mt-6">Artykuł USD/PLN</h2>
          <pre className="bg-gray-100 p-4 whitespace-pre-wrap rounded-xl mt-2">{usdArticle}</pre>
        </div>
      )}
    </div>
  );
}
