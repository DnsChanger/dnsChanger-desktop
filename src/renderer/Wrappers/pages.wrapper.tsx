import { NavbarComponent } from '../component/head/navbar.component';
import { BottomNavigation } from 'react-daisyui';
import { TbCloudDataConnection } from 'react-icons/tb';
interface Props {
    children: JSX.Element;
}
export function PageWrapper(prop: Props) {
    const size = 30

    return (
        <div>
            <NavbarComponent />
            <div className="lg:flex-row dark:bg-zinc-500/95">
                <main className=" rounded-3xl dark:bg-zinc-900/95">
                    {prop.children}
                </main>
            </div>
            <BottomNavigation size="xs">
                <div className="active">
                    <TbCloudDataConnection size={size} />
                </div>

            </BottomNavigation>

        </div>
    )
}