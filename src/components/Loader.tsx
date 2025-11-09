const Loader = () => {
  const loaderStyle = {
    width: "50px",
    padding: "8px",
    aspectRatio: "1",
    borderRadius: "50%",
    background: "#073066",
    WebkitMask:
      "conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box",
    mask: "conic-gradient(#0000 10%, #000), linear-gradient(#000 0 0) content-box",
    WebkitMaskComposite: "source-out",
    maskComposite: "subtract",
    animation: "l3 1s infinite linear",
  };

  return (
    <>
      <style>
        {`
          @keyframes l3 {
            to { transform: rotate(1turn); }
          }
        `}
      </style>
      <div style={loaderStyle}></div>
    </>
  );
};

export default Loader;
