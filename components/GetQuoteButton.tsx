import Link from "next/link";
import React from "react";
import { Button } from "./ui/button";

function GetQuoteButton() {
  return (
    <Link href={"/protected/quote"}>
      <Button className="mt-4 px-10">Get a Quote</Button>
    </Link>
  );
}

export default GetQuoteButton;
