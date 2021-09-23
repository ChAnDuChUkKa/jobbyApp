import './index.css'

const FilterGroups = props => {
  const renderEmploymentCategories = () => {
    const {employmentTypesList} = props
    return employmentTypesList.map(eachCategory => {
      const {selectEmployment} = props
      const selectCategory = () => {
        selectEmployment(eachCategory.employmentTypeId)
      }
      return (
        <li className="employment-item" key={eachCategory.employmentTypeId}>
          <input
            type="checkbox"
            id={eachCategory.employmentTypeId}
            name="employment"
            value={eachCategory.employmentTypeId}
            onClick={selectCategory}
          />
          <label htmlFor={eachCategory.employmentTypeId}>
            {eachCategory.label}
          </label>
        </li>
      )
    })
  }
  const renderEmployment = () => (
    <>
      <h1 className="employment-heading">Type of Employment</h1>
      <ul className="list-categories">{renderEmploymentCategories()}</ul>
    </>
  )

  const renderSalaryRangesList = () => {
    const {salaryRangesList} = props
    return salaryRangesList.map(eachSalary => {
      const {selectSalary, salary} = props
      const selectSalaryCategory = () => selectSalary(eachSalary.salaryRangeId)
      return (
        <li className="employment-item" key={eachSalary.salaryRangeId}>
          <input
            type="radio"
            name="salaryRange"
            value={eachSalary.label}
            onClick={selectSalaryCategory}
            id={eachSalary.salaryRangeId}
          />
          <label htmlFor={eachSalary.salaryRangeId}>{eachSalary.label}</label>
        </li>
      )
    })
  }

  const renderSalaryRange = () => (
    <>
      <h1 className="employment-heading">Salary Range</h1>
      <ul className="list-categories">{renderSalaryRangesList()}</ul>
    </>
  )

  return (
    <div className="filters-section">
      {renderEmployment()}
      <hr />
      {renderSalaryRange()}
    </div>
  )
}
export default FilterGroups
