/* eslint-disable @next/next/no-img-element */
import axios from "axios";
import { useState } from "react";
import styles from "../styles/Add.module.css";
const Add = ({ currentProduct, setClose, add }) => {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState(null);
  const [desc, setDesc] = useState(null);
  const [prices, setPrices] = useState([]);
  const [extraOptions, setExtraOptions] = useState([]);
  const [extra, setExtra] = useState(null);
  console.log("currentProduct", currentProduct);
  console.log("file", file);
  const changePrice = (e, index) => {
    const currentPrices = prices;
    currentPrices[index] = e.target.value;
    setPrices(currentPrices);
  };

  const handleExtraInput = (e) => {
    setExtra({ ...extra, [e.target.name]: e.target.value });
  };

  const handleExtra = (e) => {
    setExtraOptions((prev) => [...prev, extra]);
  };

  const handleCreate = async () => {
    const data = new FormData();
    data.append("file", file);
    data.append("upload_preset", "uploads");
    try {
      const uploadRes = await axios.post(
        "https://api.cloudinary.com/v1_1/dcqxl1r1t/image/upload",
        data
      );

      const { url } = uploadRes.data;
      const newProduct = {
        title,
        desc,
        prices,
        extraOptions,
        img: url,
      };

      await axios.post("http://localhost:3000/api/products", newProduct);
      setClose(true);
      console.log("new", newProduct);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  const handleUpdate = async () => {
    const data = new FormData();
    file && data.append("file", file);
    data.append("upload_preset", "uploads");
    try {
      const uploadRes =
        file &&
        (await axios.post(
          "https://api.cloudinary.com/v1_1/dcqxl1r1t/image/upload",
          data
        ));

      const url = uploadRes.data.url || currentProduct.img;
      const newProduct = {
        title,
        desc,
        prices,
        extraOptions,
        img: url,
      };

      await axios.put("http://localhost:3000/api/products", newProduct);
      console.log("new", newProduct);
      setClose(true);
      window.location.reload();
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className={styles.container}>
      <div className={styles.wrapper}>
        <span onClick={() => setClose(true)} className={styles.close}>
          X
        </span>
        <h1>{add ? "Add a new Pizza" : "Update"}</h1>
        <div className={styles.item}>
          <label className={styles.label}>Choose an image</label>
          {!currentProduct ? (
            <>
              <input
                id="img"
                accept=".png, .jpg, .jpeg"
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <img
                src={file && URL.createObjectURL(file)}
                className={styles.img}
                layout="fill"
                alt="img"
              />
            </>
          ) : (
            <>
              <input
                id="img"
                accept=".png, .jpg, .jpeg"
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
              />
              <img
                src={!file ? currentProduct.img : URL.createObjectURL(file)}
                className={styles.img}
                layout="fill"
                alt="img"
              />
            </>
          )}
        </div>
        <div className={styles.item}>
          <label className={styles.label}>Title</label>
          <input
            className={styles.input}
            type="text"
            onChange={(e) => setTitle(e.target.value)}
            defaultValue={currentProduct ? currentProduct.title : null}
          />
        </div>
        <div className={styles.item}>
          <label className={styles.label}>Desc</label>
          <textarea
            rows={4}
            type="text"
            onChange={(e) => setDesc(e.target.value)}
            defaultValue={currentProduct && currentProduct.desc}
          />
        </div>
        <div className={styles.item}>
          <label className={styles.label}>Prices</label>
          <div className={styles.priceContainer}>
            <input
              className={`${styles.input} ${styles.inputSm}`}
              type="number"
              placeholder="Small"
              onChange={(e) => changePrice(e, 0)}
              defaultValue={currentProduct && currentProduct.prices[0]}
            />
            <input
              className={`${styles.input} ${styles.inputSm}`}
              type="number"
              placeholder="Medium"
              onChange={(e) => changePrice(e, 1)}
              defaultValue={currentProduct && currentProduct.prices[1]}
            />
            <input
              className={`${styles.input} ${styles.inputSm}`}
              type="number"
              placeholder="Large"
              onChange={(e) => changePrice(e, 2)}
              defaultValue={currentProduct && currentProduct.prices[2]}
            />
          </div>
        </div>
        <div className={styles.item}>
          <label className={styles.label}>Extra</label>
          <div className={styles.extra}>
            <input
              className={`${styles.input} ${styles.inputSm}`}
              type="text"
              placeholder="Item"
              name="text"
              onChange={handleExtraInput}
            />
            <input
              className={`${styles.input} ${styles.inputSm}`}
              type="number"
              placeholder="Price"
              name="price"
              onChange={handleExtraInput}
            />
            <button className={styles.extraButton} onClick={handleExtra}>
              Add
            </button>
          </div>
          <div className={styles.extraItems}>
            {!currentProduct
              ? extraOptions.map((option) => (
                  <span key={option.text} className={styles.extraItem}>
                    {option.text}
                  </span>
                ))
              : currentProduct.extraOptions.map((option) => (
                  <span key={option.text} className={styles.extraItem}>
                    {option.text}
                  </span>
                ))}
          </div>
        </div>
        <button
          className={styles.addButton}
          onClick={add ? handleCreate : handleUpdate}
        >
          {add ? "Create" : "Update"}
        </button>
      </div>
    </div>
  );
};

export default Add;
