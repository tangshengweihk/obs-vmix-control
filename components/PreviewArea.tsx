export default function PreviewArea() {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      <div className="bg-black aspect-video flex items-center justify-center">
        <span className="text-xl">Preview</span>
      </div>
      <div className="bg-red-600 aspect-video flex items-center justify-center">
        <span className="text-xl">Program</span>
      </div>
    </div>
  )
}

