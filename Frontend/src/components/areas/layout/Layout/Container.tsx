export default function Container({ children }: React.PropsWithChildren) {

    return (
        <div className="bg-gray-100 text-gray-900 min-h-screen flex flex-col">
            {children}
        </div>
    )
}