import {useState} from 'react'
import * as Yup from 'yup'
import {useFormik} from 'formik'
import {getUserByToken, selectRole} from '../core/_requests'
import {useAuth} from '../core/Auth'
import {AuthModel} from '../core/_models.ts'
import {KTIcon} from '../../../../_metronic/helpers'

const selectRoleSchema = Yup.object().shape({
  role: Yup.string().required('Role is required'),
})

const initialValues = {
  role: '',
}

const roleDescriptions = {
  ADMIN: {
    icon: 'address-book',
    title: 'Administrator',
    description: '',
  },
  VIEWER: {
    icon: 'briefcase',
    title: 'Viewer',
    description: '',
  },
}

export function SelectRole() {
  const [loading, setLoading] = useState(false)
  const {saveAuth, setCurrentUser, currentUser} = useAuth()

  const formik = useFormik({
    initialValues,
    validationSchema: selectRoleSchema,
    onSubmit: async (values, {setStatus, setSubmitting}) => {
      setLoading(true)
      try {
        const response = await selectRole(values.role)
        const auth: AuthModel = response?.data
        saveAuth(auth)
        const {data: user} = await getUserByToken(auth.token)
        setCurrentUser(user)
      } catch (error) {
        console.error(error)
        saveAuth(undefined)
        setStatus('Error setting role')
        setSubmitting(false)
        setLoading(false)
      }
    },
  })

  return (
    <form
      className='form w-100'
      onSubmit={formik.handleSubmit}
      noValidate
      id='kt_select_role_form'
    >
      {/* begin::Heading */}
      <h2 className='fw-bolder d-flex align-items-center text-gray-900'>
        Choose Account Type
        <i
          className='fas fa-exclamation-circle ms-2 fs-7'
          data-bs-toggle='tooltip'
          title='Billing is issued based on your selected account type'
        ></i>
      </h2>
      {/* begin::Heading */}

      <div className='fv-row'>
        <div className='row'>
          {currentUser?.roles?.map((role: string, index: number) => {
            const roleData = roleDescriptions[role]
            return (
              <div className='col-lg-6' key={index}>
                <input
                  type='radio'
                  className='btn-check'
                  id={`kt_create_account_form_account_type_${role}`}
                  {...formik.getFieldProps('role')}
                  value={role}
                  checked={formik.values.role === role}
                />
                <label
                  className='btn btn-outline btn-outline-dashed btn-outline-default p-7 d-flex align-items-center mb-10'
                  htmlFor={`kt_create_account_form_account_type_${role}`}
                >
                  <KTIcon iconName={roleData.icon} className='fs-3x me-5' />

                  <span className='d-block fw-bold text-start'>
                    <span className='text-gray-900 fw-bolder d-block fs-4 mb-2'>
                      {roleData.title}
                    </span>
                    <span className='text-gray-500 fw-bold fs-6'>{roleData.description}</span>
                  </span>
                </label>
              </div>
            )
          })}
        </div>
      </div>

      {/* begin::Action */}
      <div className='d-grid mb-10'>
        <button
          type='submit'
          id='kt_sign_select_role_submit'
          className='btn btn-primary'
          disabled={formik.isSubmitting || !formik.isValid}
        >
          {!loading && <span className='indicator-label'>Continue</span>}
          {loading && (
            <span className='indicator-progress' style={{display: 'block'}}>
              Please wait...
              <span className='spinner-border spinner-border-sm align-middle ms-2'></span>
            </span>
          )}
        </button>
      </div>
      {/* end::Action */}
    </form>
  )
}
