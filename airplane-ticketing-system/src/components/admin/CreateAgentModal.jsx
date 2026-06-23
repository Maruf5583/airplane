import { useState } from 'react';
import Modal from '../common/Modal';
import Input from '../common/Input';
import Button from '../common/Button';
import { useCreateAgent } from '../../hooks/useUsers';

const EMPTY_FORM = { firstName: '', lastName: '', email: '', phoneNumber: '' };

export default function CreateAgentModal({ isOpen, onClose }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const createAgent = useCreateAgent();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    createAgent.mutate(form, {
      onSuccess: () => {
        setForm(EMPTY_FORM);
        onClose();
      },
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Agent Account">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-3">
          <Input
            label="First Name"
            name="firstName"
            value={form.firstName}
            onChange={handleChange}
            required
          />
          <Input
            label="Last Name"
            name="lastName"
            value={form.lastName}
            onChange={handleChange}
            required
          />
        </div>
        <Input
          label="Email"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          required
        />
        <Input
          label="Phone Number"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={handleChange}
        />
        <p className="text-xs text-slate-400">
          The agent will receive login credentials via email.
        </p>
        <div className="flex justify-end gap-3 pt-2">
          <Button type="button" variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button type="submit" isLoading={createAgent.isPending}>
            Create Agent
          </Button>
        </div>
      </form>
    </Modal>
  );
}