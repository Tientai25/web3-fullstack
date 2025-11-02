// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract CertificateNFT is ERC721URIStorage, Ownable {
    using Strings for uint256;
    uint256 private _nextTokenId;

    // Mapping từ tokenId đến metadata
    mapping(uint256 => CertificateMetadata) public certificateMetadata;

    // Cấu trúc metadata cho certificate
    struct CertificateMetadata {
        string title;        // Tên chứng chỉ
        string issueDate;    // Ngày phát hành
        string achievementType; // Loại thành tựu (ví dụ: "Completion", "Excellence")
        address recipient;   // Người nhận
    }

    // Events
    event CertificateMinted(
        uint256 indexed tokenId,
        address indexed recipient,
        string title,
        string achievementType
    );

    constructor() ERC721("Web3 Achievement Certificate", "W3CERT") Ownable(msg.sender) {}

    // Hàm mint certificate mới
    function mintCertificate(
        address to,
        string memory title,
        string memory achievementType,
        string memory uri
    ) public onlyOwner returns (uint256) {
        uint256 tokenId = _nextTokenId++;

        // Mint NFT
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);

        // Lưu metadata
        certificateMetadata[tokenId] = CertificateMetadata({
            title: title,
            issueDate: block.timestamp.toString(),
            achievementType: achievementType,
            recipient: to
        });

        emit CertificateMinted(tokenId, to, title, achievementType);

        return tokenId;
    }

    // Lấy thông tin chi tiết của certificate
    function getCertificateDetails(uint256 tokenId)
        public
        view
        returns (CertificateMetadata memory)
    {
        require(_ownerOf(tokenId) != address(0), "Certificate does not exist");
        return certificateMetadata[tokenId];
    }

    // Lấy tất cả certificates của một địa chỉ
    function getCertificatesByOwner(address owner)
        public
        view
        returns (uint256[] memory)
    {
        uint256 balance = balanceOf(owner);
        uint256[] memory result = new uint256[](balance);
        uint256 counter = 0;
        
        for (uint256 i = 1; i < _nextTokenId; i++) {
            if (_ownerOf(i) != address(0) && _ownerOf(i) == owner) {
                result[counter] = i;
                counter++;
            }
        }
        return result;
    }

    // Các override functions bắt buộc
    function _update(address to, uint256 tokenId, address auth)
        internal
        virtual
        override
        returns (address)
    {
        return super._update(to, tokenId, auth);
    }

    function _increaseBalance(address account, uint128 value)
        internal
        virtual
        override
    {
        super._increaseBalance(account, value);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        virtual
        override
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}