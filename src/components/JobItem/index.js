import {Link} from 'react-router-dom'
import {BsStarFill} from 'react-icons/bs'
import './index.css'

const JobItem = props => {
  const {jobDetails} = props
  const {
    id,
    title,
    rating,
    location,
    companyLogoUrl,
    employmentType,
    jobDescription,
    packagePerAnnum,
  } = jobDetails

  return (
    <Link to={`/jobs/${id}`}>
      <li className="list-object">
        <div className="logo-container">
          <img
            src={companyLogoUrl}
            alt="company logo"
            className="company-logo"
          />
          <div className="title-and-rating">
            <h1 className="heading">{title}</h1>
            <div className="rating-container">
              <BsStarFill className="star" />
              <p className="rating">{rating}</p>
            </div>
          </div>
        </div>
        <div className="location-type">
          <div className="loi">
            <p className="location">{location}</p>
            <p className="type">{employmentType}</p>
          </div>
          <p className="salary">{packagePerAnnum}</p>
        </div>
        <hr className="line" />
        <div className="description-container">
          <p className="description">Description</p>
          <p className="full-description">{jobDescription}</p>
        </div>
      </li>
    </Link>
  )
}
export default JobItem
