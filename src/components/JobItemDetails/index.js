import {Component} from 'react'
import Loader from 'react-loader-spinner'
import {BsStarFill} from 'react-icons/bs'
import Cookies from 'js-cookie'
import Header from '../Header'
import './index.css'

const appConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}
class JobItemDetails extends Component {
  state = {status: appConstants.initial, jobData: []}

  componentDidMount() {
    this.detailedJob()
  }

  detailedJob = async () => {
    this.setState({status: appConstants.inProgress})
    const {match} = this.props
    const {params} = match
    const {id} = params
    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const jwtToken = Cookies.get('jwt_token')
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const detailedResponse = await fetch(apiUrl, options)
    if (detailedResponse.ok) {
      const detailedData = await detailedResponse.json()
      console.log(detailedData)
      const formattedJobData = {
        companyLogoUrl: detailedData.job_details.company_logo_url,
        companyWebsiteUrl: detailedData.job_details.company_website_url,
        employmentType: detailedData.job_details.employment_type,
        id: detailedData.job_details.id,
        jobDescription: detailedData.job_details.job_description,
        location: detailedData.job_details.location,
        packagePerAnnum: detailedData.job_details.package_per_annum,
        rating: detailedData.job_details.rating,
        title: detailedData.job_details.title,
        lifeAtCompanyDescription:
          detailedData.job_details.life_at_company.description,
        imageUrl: detailedData.job_details.life_at_company.image_url,
        skills: detailedData.job_details.skills.map(eachSkill => ({
          name: eachSkill.name,
          skillImage: eachSkill.image_url,
        })),
        similarJobs: detailedData.similar_jobs.map(eachJob => ({
          id: eachJob.id,
          similarJobImage: eachJob.company_logo_url,
          similarEmploymentType: eachJob.employment_type,
          similarJobDescription: eachJob.job_description,
          rating: eachJob.rating,
          location: eachJob.location,
          title: eachJob.title,
        })),
      }
      this.setState({jobData: formattedJobData, status: appConstants.success})
      console.log(formattedJobData)
    } else {
      this.setState({status: appConstants.failure})
    }
  }

  retry = () => {
    this.detailedJob()
  }

  renderFailureView = () => (
    <div className="failure-container">
      <img
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
        className="fail"
      />
      <h1 className="heading">Oops! Something Went Wrong</h1>
      <p className="warning">
        We cannot seem to find the page you are looking for
      </p>
      <button type="button" onClick={this.retry}>
        Retry
      </button>
    </div>
  )

  renderLoader = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderSkillSet = () => {
    const {jobData} = this.state
    const {skills} = jobData
    console.log(skills)
    return skills.map(eachSkill => (
      <li className="skill-item">
        <img
          src={eachSkill.skillImage}
          alt={eachSkill.name}
          className="skill-image"
        />
        <p className="skill-head">{eachSkill.name}</p>
      </li>
    ))
  }

  renderSimilarJobs = () => {
    const {jobData} = this.state
    const {similarJobs} = jobData
    return similarJobs.map(eachJob => (
      <li className="job-item">
        <div className="image-heading">
          <img
            src={eachJob.similarJobImage}
            alt="similar job company logo"
            className="company-logo"
          />
          <div className="title-and-rating">
            <h1 className="heading">{eachJob.title}</h1>
            <div className="rating-container">
              <BsStarFill className="star" />
              <p className="rating">{eachJob.rating}</p>
            </div>
          </div>
        </div>
        <div className="description-container">
          <p className="description">Description</p>
          <p className="full-description">{eachJob.similarJobDescription}</p>
        </div>
        <div className="location-type">
          <div className="loi">
            <p className="location">{eachJob.location}</p>
            <p className="type">{eachJob.similarEmploymentType}</p>
          </div>
        </div>
      </li>
    ))
  }

  renderSuccessView = () => {
    const {jobData} = this.state
    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      id,
      imageUrl,
      jobDescription,
      lifeAtCompanyDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobData
    return (
      <div className="detailed-view-container">
        <div className="detailed-card">
          <div className="card-details">
            <img
              src={companyLogoUrl}
              alt="job details company logo"
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
            <div className="des-page">
              <p className="description">Description</p>
              <p className="link-element">
                <a
                  href={companyWebsiteUrl}
                  target="#"
                  key="company_website_url"
                >
                  Visit
                </a>
              </p>
            </div>
            <p className="full-description">{jobDescription}</p>
          </div>
          <h1 className="skills-heading">Skills</h1>
          <ul className="skills-list">{this.renderSkillSet()}</ul>
          <h1 className="heading">Life At Company</h1>
          <div className="life-at-company">
            <p className="description">{lifeAtCompanyDescription}</p>
            <img src={imageUrl} alt="life at company" className="image" />
          </div>
        </div>
        <div className="similar-job-container">
          <h1 className="heading">Similar Jobs</h1>
          <ul className="similar-jobs">{this.renderSimilarJobs()}</ul>
        </div>
      </div>
    )
  }

  renderJobDetails = () => {
    const {status} = this.state
    switch (status) {
      case appConstants.failure:
        return this.renderFailureView()
      case appConstants.success:
        return this.renderSuccessView()
      case appConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <>
        <Header />
        <div className="job-detailed-container">{this.renderJobDetails()}</div>
      </>
    )
  }
}
export default JobItemDetails
