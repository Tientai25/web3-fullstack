import React, { useEffect } from 'react';
import { useNFT } from '../contexts/NFTContext';

export default function CertificateGallery() {
  const { userCertificates, fetchUserCertificates, isLoading } = useNFT();

  useEffect(() => {
    fetchUserCertificates();
  }, [fetchUserCertificates]);

  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
        <p className="mt-4 text-gray-600">Đang tải certificates...</p>
      </div>
    );
  }

  if (userCertificates.length === 0) {
    return (
      <div className="text-center py-8 bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl p-4">
        <p className="text-gray-600">Chưa có certificate nào.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/60 backdrop-blur-md border border-slate-200 rounded-2xl p-4 sm:p-6 shadow-sm">
      <h3 className="text-lg font-semibold mb-4">Your Achievement Certificates</h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {userCertificates.map((cert) => (
          <div
            key={cert.tokenId}
            className="border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
          >
            <img
              src={cert.image}
              alt={cert.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h4 className="font-semibold text-lg mb-2">{cert.title}</h4>
              <p className="text-sm text-gray-600 mb-2">{cert.description}</p>
              <div className="flex items-center justify-between text-sm">
                <span className="bg-indigo-100 text-indigo-800 px-2 py-1 rounded">
                  {cert.achievementType}
                </span>
                <span className="text-gray-500">
                  ID: #{cert.tokenId}
                </span>
              </div>
              <div className="mt-3 text-xs text-gray-500">
                Issued: {new Date(parseInt(cert.issueDate) * 1000).toLocaleDateString()}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}