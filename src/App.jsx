import React, { useState, useEffect } from "react";

function App() {
  const [data, setData] = useState(null);
  const [images, setImages] = useState([]); 
  const [page, setPage] = useState(2);
  const [loadingData, setLoadingData] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);

  const fetchData = async () => {
    try {
      setLoadingData(true); 
      const response = await fetch(`https://picsum.photos/v2/list?page=${page}&limit=10`);
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoadingData(false); 
    }
  };
  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchImage = async (id) => {
    try {
      setLoadingImages(true); 
      const response = await fetch(`https://picsum.photos/id/${id}/400/400`);
      const imageURL = response.url;
      return imageURL;
    } catch (error) {
      console.error("Error fetching image:", error);
      return null;
    } finally {
      setLoadingImages(false); 
    }
  };

  useEffect(() => {
    const fetchImages = async () => {
    
      if (data) {
        const imagesArray = [];
        for (const item of data) {
          const imageURL = await fetchImage(item.id);
          if (imageURL) {
            imagesArray.push({ id: item.id, url: imageURL, author: item.author });
          }
        }
        setImages(prevImages => [...prevImages, ...imagesArray]);
      }
    };

    fetchImages();
  }, [data]);
  

  const loadMore = () => {
    setPage(prev => prev +1)
  };
  console.log(images.length)
  return (
    <>
      <h1>Gallery</h1>
      {loadingData || loadingImages ? (
        <h2>Loading...</h2>
      ) : (
        <div className="Container">
          <div className="pictureBox">
            {images.map((item) => (
              <div className="singleItem" key={item.id}>
                <img src={item.url} alt={`${item.author}'s picture`} />
                <p>{item.author}</p>
              </div>
            ))}
          </div>
          <button className="LoadMore" onClick={loadMore}>
            Load more
          </button>
        </div>
      )}
    </>
  );
}

export default App;
