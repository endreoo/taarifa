function ApartmentCard({ apartment }) {
  // existing component code...
  
  return (
    <div className="apartment-card">
      <h3>{apartment.name}</h3>
      {!apartment.soldOut ? (
        <div className="price">
          ${apartment.price}/night
        </div>
      ) : (
        <div className="sold-out">
          Sold Out
        </div>
      )}
      {/* rest of the card content... */}
    </div>
  );
} 