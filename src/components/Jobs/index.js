import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import ProfileView from '../ProfileView'
import JobItem from '../JobItem'
import FiltersGroup from '../FiltersGroup'

import './index.css'

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
    isChecked: false,
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
    isChecked: false,
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
    isChecked: false,
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
    isChecked: false,
  },
]
const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const appConstants = {
  initial: 'INITIAL',
  inProgress: 'INPROGRESS',
  success: 'SUCCESS',
  failure: 'FAILURE',
}

class Jobs extends Component {
  state = {
    searchInput: '',
    activeEmployment: [],
    activeSalaryRange: '',
    profileSection: [],
    jobsList: [],
    jobStatus: appConstants.initial,
    profileStatus: appConstants.initial,
  }

  componentDidMount() {
    this.getFullView()
  }

  getFullView = async () => {
    this.setState({
      jobStatus: appConstants.inProgress,
      profileStatus: appConstants.inProgress,
    })
    const jwtToken = Cookies.get('jwt_token')
    const {searchInput, activeEmployment, activeSalaryRange} = this.state
    const joinEmploymentType = activeEmployment.join(',')
    const profileApiUrl = 'https://apis.ccbp.in/profile'
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const profileResponse = await fetch(profileApiUrl, options)

    if (profileResponse.ok) {
      const data = await profileResponse.json()
      const formattedProfileData = {
        name: data.profile_details.name,
        profileImage: data.profile_details.profile_image_url,
        shortBio: data.profile_details.short_bio,
      }
      this.setState({
        profileSection: formattedProfileData,
        profileStatus: appConstants.success,
      })
    } else {
      this.setState({profileStatus: appConstants.failure})
    }

    const jobsApiUrl = `https://apis.ccbp.in/jobs?employment_type=${joinEmploymentType}&minimum_package=${activeSalaryRange}&search=${searchInput}`
    console.log(jobsApiUrl)
    const jobsResponse = await fetch(jobsApiUrl, options)
    if (jobsResponse.ok) {
      const jobData = await jobsResponse.json()
      const formattedData = jobData.jobs.map(eachJob => ({
        companyLogoUrl: eachJob.company_logo_url,
        id: eachJob.id,
        employmentType: eachJob.employment_type,
        jobDescription: eachJob.job_description,
        location: eachJob.location,
        packagePerAnnum: eachJob.package_per_annum,
        rating: eachJob.rating,
        title: eachJob.title,
      }))

      this.setState({
        jobsList: formattedData,
        jobStatus: appConstants.success,
      })
    } else {
      this.setState({
        jobStatus: appConstants.failure,
      })
    }
  }

  retry = () => this.getFullView()

  renderFailure = () => (
    <button type="button" className="button" onClick={this.retry}>
      Retry
    </button>
  )

  changeInput = event => {
    this.setState({searchInput: event.target.value})
  }

  searchOutput = () => this.getFullView()

  renderNoView = () => (
    <div className="no-view">
      <img
        src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
        alt="no jobs"
        className="no-jobs"
      />
      <h1 className="heading">No jobs Found</h1>
      <p className="description">
        We could not found any jobs.Try other filters.
      </p>
    </div>
  )

  renderJobsList = () => {
    const {jobsList, searchInput} = this.state
    const filteredSearch = jobsList.filter(eachList =>
      eachList.title.toLowerCase().includes(searchInput),
    )
    const isPresent = jobsList.length > 0
    return isPresent ? (
      <ul className="list-of-jobs">
        {filteredSearch.map(eachJob => (
          <JobItem jobDetails={eachJob} key={eachJob.id} />
        ))}
      </ul>
    ) : (
      this.renderNoView()
    )
  }

  renderJobs = () => {
    const {jobStatus} = this.state
    switch (jobStatus) {
      case appConstants.success:
        return this.renderJobsList()
      case appConstants.failure:
        return this.renderFailure()
      case appConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  renderLoader = () => (
    <div className="loader-container" testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  onSelectSalary = activeRangeId => {
    this.setState({activeSalaryRange: activeRangeId}, this.getFullView)
  }

  onSelectOption = selected => {
    const {activeEmployment} = this.state

    if (activeEmployment.includes(selected)) {
      const indexOfSelected = activeEmployment.indexOf(selected)
      const filteredActiveEmployment = activeEmployment.splice(
        indexOfSelected,
        1,
      )

      this.setState({filteredActiveEmployment}, this.getFullView)
    } else {
      this.setState(
        prevState => ({
          activeEmployment: [...prevState.activeEmployment, selected],
        }),
        this.getFullView,
      )
    }
  }

  renderProfileView = () => {
    const {profileSection} = this.state
    return <ProfileView profileDetails={profileSection} />
  }

  renderProfile = () => {
    const {profileStatus} = this.state
    switch (profileStatus) {
      case appConstants.success:
        return this.renderProfileView()
      case appConstants.failure:
        return this.renderFailure()
      case appConstants.inProgress:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    const {activeEmployment, activeSalaryRange, searchInput} = this.state
    console.log(activeSalaryRange)
    return (
      <div className="job-container">
        <Header />
        <div className="profile-and-jobs-container">
          <div className="side-container">
            {this.renderProfile()}
            <FiltersGroup
              employment={activeEmployment}
              salary={activeSalaryRange}
              selectEmployment={this.onSelectOption}
              selectSalary={this.onSelectSalary}
              employmentTypesList={employmentTypesList}
              salaryRangesList={salaryRangesList}
            />
          </div>
          <div className="search-and-jobs">
            <div className="searchBar">
              <input
                type="search"
                value={searchInput}
                onChange={this.changeInput}
                placeholder="search"
                className="search-bar"
              />
              <button
                type="button"
                testid="searchButton"
                onClick={this.searchOutput}
                className="search-button"
              >
                <BsSearch className="search-icon" />
              </button>
            </div>
            {this.renderJobs()}
          </div>
        </div>
      </div>
    )
  }
}
export default Jobs
