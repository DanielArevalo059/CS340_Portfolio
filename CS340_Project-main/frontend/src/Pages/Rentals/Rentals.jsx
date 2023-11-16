import { useState, useEffect, useRef } from "react";
import { RentalsTable } from "./RentalsTable";
import { Get } from "../../API/RestfulMethods";

export function Rentals() {
  const [rentals, setRentals] = useState([]);

  const hasMounted = useRef(false);

  const getRentals = async () => {
    const listOfRentals = await Get("/rentals");
    setRentals(listOfRentals);
  };

  useEffect(() => {
    if (!hasMounted.current) {
      hasMounted.current = true;
      getRentals();
    }
  }, []);

  return <RentalsTable rentals={rentals} />;
}
