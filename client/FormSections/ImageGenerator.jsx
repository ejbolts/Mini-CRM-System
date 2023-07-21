import { useState, useContext } from "react";
import { Button, CircularProgress, TextField } from "@mui/material";
import { AiAssistContext } from "../App";

function ImageGenerator({ productName, productImageURL, setProductImageURL }) {
  const { openai_key } = useContext(AiAssistContext);
  const [loading, setLoading] = useState(false);

  const generateImage = async (productName) => {
    setLoading(true);
    const response = await fetch(
      "https://mini-crm-express-server.onrender.com/get-openai-image",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ inputMessage: productName, openai_key }),
      }
    );

    const responseData = await response.json();
    console.log("responseData:", responseData);

    setLoading(false);
    setProductImageURL(responseData);
  };

  return (
    <div className="Image Generator" style={{ marginLeft: "16px" }}>
      {loading ? (
        <div>
          <h2>Generating Image Please Wait...</h2>
          <CircularProgress size={32} />
        </div>
      ) : (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {productImageURL?.length > 0 ? (
            <img
              style={{ marginTop: "16px" }}
              className="result-image"
              src={productImageURL}
              alt="result"
            />
          ) : (
            <></>
          )}
          <Button
            onClick={() => generateImage(productName)}
            variant="outlined"
            style={{ marginTop: "16px" }}
          >
            Generate an Image
          </Button>
        </div>
      )}
    </div>
  );
}

export default ImageGenerator;
