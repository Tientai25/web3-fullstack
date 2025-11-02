import React, { useState } from 'react';
import { useNFT } from '../contexts/NFTContext';

export default function MintCertificateForm() {
  const { mintCertificate, isLoading, error } = useNFT();
  const [file, setFile] = useState(null);
  const [metadata, setMetadata] = useState({
    title: '',
    description: '',
    achievementType: 'Completion' // mặc định
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!file) {
        alert('Vui lòng chọn file hình ảnh');
        return;
      }
      const txHash = await mintCertificate(file, metadata);
      alert(`Certificate đã được mint thành công! Tx: ${txHash}`);
      // Reset form
      setFile(null);
      setMetadata({
        title: '',
        description: '',
        achievementType: 'Completion'
      });
    } catch (err) {
      console.error(err);
      alert('Không thể mint certificate. Vui lòng thử lại.');
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('image/')) {
      setFile(file);
    } else {
      alert('Vui lòng chọn file hình ảnh');
    }
  };

  return (
    <div className="bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Mint Achievement Certificate</h3>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tiêu đề chứng chỉ
          </label>
          <input
            type="text"
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={metadata.title}
            onChange={(e) => setMetadata({ ...metadata, title: e.target.value })}
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Mô tả
          </label>
          <textarea
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={metadata.description}
            onChange={(e) => setMetadata({ ...metadata, description: e.target.value })}
            rows="3"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Loại thành tựu
          </label>
          <select
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
            value={metadata.achievementType}
            onChange={(e) => setMetadata({ ...metadata, achievementType: e.target.value })}
          >
            <option value="Completion">Hoàn thành</option>
            <option value="Excellence">Xuất sắc</option>
            <option value="Achievement">Thành tựu</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Hình ảnh chứng chỉ
          </label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="w-full"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            isLoading
              ? 'bg-indigo-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {isLoading ? 'Đang xử lý...' : 'Mint Certificate'}
        </button>
      </form>
    </div>
  );
}