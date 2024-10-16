import React, { useState } from "react";
import "../styles/pages/_create.scss";

const Create: React.FC = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle form submission logic here
    console.log(formData);
  };

  return (
    <div className="create">
      <h1 className="create__title">Create NFT</h1>
      <form className="create__form" onSubmit={handleSubmit}>
        <div className="create__form-group">
          <label htmlFor="name" className="create__label">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="create__input"
            required
          />
        </div>
        <div className="create__form-group">
          <label htmlFor="description" className="create__label">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="create__textarea"
            required
          />
        </div>
        <div className="create__form-group">
          <label htmlFor="price" className="create__label">
            Price (ONE)
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="create__input"
            required
          />
        </div>
        <button
          type="submit"
          className="create__submit btn btn--primary btn--large"
        >
          Create NFT
        </button>
      </form>
    </div>
  );
};

export default Create;
