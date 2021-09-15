import './index.css'

const ProfileView = props => {
  const {profileDetails} = props
  const {name, profileImage, shortBio} = profileDetails
  return (
    <div className="profile-section">
      <img src={profileImage} alt="profile" className="profile-image" />
      <p className="name">{name}</p>
      <p className="bio">{shortBio}</p>
    </div>
  )
}
export default ProfileView
