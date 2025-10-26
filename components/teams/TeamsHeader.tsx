import { Button } from "@/components/ui/button";

export function TeamsHeader() {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold">Clients list</h1>
        <div className="flex gap-2">
          <Button variant="default">Options</Button>
          <Button variant="primary">Add</Button>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-2">
        View, add, edit and delete your client's details.{" "}
        <a
          href="https://www.fresha.com/help-center/knowledge-base/clients/50-create-and-add-new-client-profiles"
          target="_blank"
          className="text-blue-600 underline"
        >
          Learn more
        </a>
      </p>
    </div>
  );
}
