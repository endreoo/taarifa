const Image = ({ src, alt }) => {
  return (
    <img 
      src={src}
      alt={alt}
      loading="lazy"
      width="100%"
      height="auto"
    />
  );
};

export default Image; 