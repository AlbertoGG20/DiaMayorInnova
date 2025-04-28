function ClassGroupDetail(props) {
    return (
        <ul>
            <h3>Curso {props.course} {props.course_module} {props.modality}</h3>
            <li>Curso: {props.course}</li>
            <li>Módulo: {props.course_module}</li>
            <li>Modalidad: {props.modality}</li>
            <li>Número de estudiantes: {props.number_students}</li>
            <li>Máximo de estudiantes: {props.max_students}</li>
            <li>Aula: {props.location}</li>
            <li>Horas semanales: {props.weekly_hours}</li>
        </ul>
    )
}

export default ClassGroupDetail;