export const FormField = ({
  labelClassName = 'user_label',
  label = '',
  className='user_item',
  type = 'text',
  name,
  value,
  placeholder,
  onChange,
 }) => (
  <label htmlFor={name} className={label ? labelClassName : ''}>
    {label}
    <input
      type={type}
      id={name}
      name={name}
      className={className}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
    />
  </label>
);