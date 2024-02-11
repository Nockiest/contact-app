import React from 'react'
import { useEffect, useState } from 'react';
import { getStorage, ref, getDownloadURL } from 'firebase/storage';


type ProfilePictureProps = {
    photoURL: string|undefined
}

const ProfilePicture: React.FC<ProfilePictureProps> = ({ photoURL }) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const placeholderUrl = '../assets/placeholder.png'
  useEffect(() => {
    const fetchImage = async () => {
      // Check if photoURL is a Firebase storage path
      if (photoURL&& photoURL.startsWith('images/')  ) { //&& photoURL.startsWith('images/')
        const storage = getStorage();
        const imageRef = ref(storage, photoURL);

        try {
          const url = await getDownloadURL(imageRef);
          setImageUrl(url);
        } catch (error) {
          console.error('Error fetching image from Firebase:', error);
          // Set imageUrl to null or a placeholder image URL if download fails
          setImageUrl(null);
        }
      } else if (photoURL && photoURL.startsWith('http')) {
        // If photoURL is a URL, use it directly
        setImageUrl(photoURL);
      } else {
        // If photoURL is neither a Firebase storage path nor a URL, set imageUrl to null or a placeholder image URL
        setImageUrl(null);
      }
    };

    fetchImage();
  }, [photoURL]);


  return (
    <div>


      <div
        style={{
          border: "1px solid",
          width: "150px",
          height: "150px",
          margin: "auto",
          overflow: "hidden" // This will ensure that the image does not overflow the div
        }}
      >
        <img
          src={imageUrl!==null? imageUrl:'../assets/placeholder.png'}
          alt="Contact"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />
       </div>
    </div>
  );
};

export default ProfilePicture;