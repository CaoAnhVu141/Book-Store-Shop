import { useCurrentApp } from "components/context/app.context"

const AppHeader = () => {
    const {user} = useCurrentApp();
    return(
        <>
            <div>
                {JSON.stringify(user?.name || null)}
            </div>
        </>
    )
}

export default AppHeader