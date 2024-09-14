export default function BlogCardSkeleton() {
    return (
        <div className="my-6 flex sm:mr-3 sm:flex-row flex-col items-center sm:justify-center gap-3 text-gray-200 animate-pulse">
            <div className="w-[97%] sm:w-[29%] sm:ml-3 rounded-md overflow-hidden h-[165px]">
                <div className="w-full h-full bg-gray-200" />
            </div>

            <div className="w-full sm:w-[71%] pl-3 sm:pl-2 flex flex-col gap-2">
                <div className="max-h-14 text-lg bg-gray-200 rounded-md">
                    this is a test title
                </div>

                <div className="rounded-md max-h-9 text-[11.5px] font-medium bg-gray-200 my-1 pr-4">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit.
                    Porro mollitia eveniet non quibusdam molestiae, pariatur a
                </div>

                <div className="text-[11.4px] flex items-center gap-[6px]">
                    <div className="flex border-2 bg-gray-200 rounded-md">
                        loreml
                    </div>

                    <span className="bg-gray-200 rounded-md">
                        posted by somene
                    </span>

                    <div className="bg-gray-200 rounded-md">some time ago</div>
                </div>

                <div className="flex gap-3 items-center pt-1">
                    <div className=" bg-gray-200 rounded-md">likes</div>

                    <div className="bg-gray-200 rounded-md">cmnt</div>
                </div>
            </div>
        </div>
    );
}
