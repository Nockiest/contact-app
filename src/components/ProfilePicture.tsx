import React from 'react'


type ProfilePictureProps = {
    photoURL: string|undefined
}
const ProfilePicture: React.FC<ProfilePictureProps> = ({photoURL}) => {
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
            src={photoURL}
            alt="Contact"
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover"
            }}
          />
        </div>
      </div>
    )
  }

  export default ProfilePicture