import React from 'react'
import { useNavigate } from "react-router-dom";

const ButtonBack = () => {
  const navigate = useNavigate();

  return (
    <button className="btn light" onClick={() => navigate(-1)}>
      <i className="fi fi-rr-arrow-small-left"></i>
    </button>
  )
}

export default ButtonBack