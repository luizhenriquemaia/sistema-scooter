import { getMovements, getMovementsWithFilters, deleteMovement } from '../../actions/movement'

export default function Movements() {
    const [userWantsToDeleteMovement, setUserWantsToDeleteMovement] = useState(false)
    const [idMovementUserWantsToDelete, setIdMovementUserWantsToDelete] = useState(-1)
}

const handleDeleteMovement = (idMovement) => {
    setIdMovementUserWantsToDelete(idMovement)
    setUserWantsToDeleteMovement(true)
}

const handleConfirmDelete = () => {
    if (idMovementUserWantsToDelete >= 0) {
        alert.info("a movimentação será excluida")
        dispatch(deleteMovement(idMovementUserWantsToDelete))
        setUserWantsToDeleteMovement(false)
        setIdMovementUserWantsToDelete(-1)
    }
    
}

const handleCancelDelete = () => {
    setUserWantsToDeleteMovement(false)
    setIdMovementUserWantsToDelete(-1)
    alert.info("ação cancelada")
}

<td className="delete" onClick={() => handleDeleteMovement(movement.id)}>Delete</td>

<div className={userWantsToDeleteMovement === true ? "content dialog-section show-up" : "content dialog-section"}>
    <section className="section-main-box dialog-box">
        <div className="message">
            <h3>Você tem certeza que deseja excluir essa movimentação?</h3>
        </div>
        <div className="buttonBox">
            <button className="submit-button clean" onClick={handleConfirmDelete}>Excluir</button>
            <button className="submit-button confirm" onClick={handleCancelDelete}> Cancelar</button>  
        </div>
    </section>
</div>