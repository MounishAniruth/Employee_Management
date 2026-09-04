import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled, { keyframes } from "styled-components";
import api from "../utils/api";
import {
  ArrowLeft,
  Folder,
  UploadCloud,
  X,
  Trash2,
  ChevronRight,
} from "lucide-react";

// =====================================================
// LORRY DOCUMENTS PAGE
// =====================================================

const LorryDocumentsPage = () => {
  const { lorryId } = useParams();
  const navigate = useNavigate();

  const [lorry, setLorry] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [activeFolder, setActiveFolder] = useState(null); // 'rc_book', 'insurance', 'pollution'
  const [uploading, setUploading] = useState(false);
  
  // Lightbox state
  const [lightboxIndex, setLightboxIndex] = useState(-1);

  const fileInputRef = useRef(null);

  const userType = localStorage.getItem("userType");
  const canEdit = userType === "owner" || userType === "manager";

  // =====================================================
  // FETCH LORRY DETAILS
  // =====================================================
  useEffect(() => {
    const fetchLorry = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/lorry/${lorryId}`);
        setLorry(res.data);
        setError(null);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load lorry details.");
      } finally {
        setLoading(false);
      }
    };

    fetchLorry();
  }, [lorryId]);


  // =====================================================
  // GET URLS FOR FOLDER
  // =====================================================
  const getUrls = (folderType) => {
    if (!lorry) return [];
    let urls = [];
    if (folderType === 'rc_book') urls = lorry.rc_book_urls;
    else if (folderType === 'insurance') urls = lorry.insurance_urls;
    else if (folderType === 'pollution') urls = lorry.pollution_urls;

    if (!urls) return [];
    if (typeof urls === 'string') {
      try {
        return JSON.parse(urls);
      } catch(e) {
        return [];
      }
    }
    return urls;
  };


  // =====================================================
  // HANDLE UPLOAD
  // =====================================================
  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    if (!canEdit) return alert("You are not authorized to upload documents.");

    const formData = new FormData();
    formData.append("documentType", activeFolder);
    
    // Max 5 files
    const maxFiles = Math.min(files.length, 5);
    for (let i = 0; i < maxFiles; i++) {
      formData.append("documents", files[i]);
    }

    try {
      setUploading(true);
      const res = await api.post(`/lorry/${lorryId}/documents`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      
      // Update local state
      setLorry(prev => {
        const updated = { ...prev };
        if (activeFolder === 'rc_book') updated.rc_book_urls = res.data.urls;
        else if (activeFolder === 'insurance') updated.insurance_urls = res.data.urls;
        else if (activeFolder === 'pollution') updated.pollution_urls = res.data.urls;
        return updated;
      });

      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      alert(err.response?.data?.message || "Error uploading documents.");
    } finally {
      setUploading(false);
    }
  };


  // =====================================================
  // HANDLE DELETE
  // =====================================================
  const handleDelete = async (url, e) => {
    e.stopPropagation();
    if (!canEdit) return;

    if (!window.confirm("Are you sure you want to delete this document?")) return;

    try {
      setUploading(true);
      const res = await api.delete(`/lorry/${lorryId}/documents`, {
        data: { documentType: activeFolder, url }
      });

      // Update local state
      setLorry(prev => {
        const updated = { ...prev };
        if (activeFolder === 'rc_book') updated.rc_book_urls = res.data.urls;
        else if (activeFolder === 'insurance') updated.insurance_urls = res.data.urls;
        else if (activeFolder === 'pollution') updated.pollution_urls = res.data.urls;
        return updated;
      });
    } catch (err) {
      alert(err.response?.data?.message || "Error deleting document.");
    } finally {
      setUploading(false);
    }
  };


  // =====================================================
  // ENSURE HTTPS
  // =====================================================
  const ensureHttps = (url) => {
    if (!url) return '';
    const trimmedUrl = url.trim();
    if (trimmedUrl.startsWith('http://')) return trimmedUrl.replace('http://', 'https://');
    if (trimmedUrl.startsWith('//')) return 'https:' + trimmedUrl;
    if (!trimmedUrl.startsWith('http')) return 'https://' + trimmedUrl;
    return trimmedUrl;
  };


  // =====================================================
  // RENDER FOLDERS VIEW
  // =====================================================
  const renderFolders = () => {
    const folders = [
      { id: 'rc_book', name: 'RC Book', count: getUrls('rc_book').length },
      { id: 'insurance', name: 'Insurance', count: getUrls('insurance').length },
      { id: 'pollution', name: 'Pollution Certificate', count: getUrls('pollution').length },
    ];

    return (
      <FolderGrid>
        {folders.map(folder => (
          <FolderCard key={folder.id} onClick={() => setActiveFolder(folder.id)}>
            <FolderIconWrapper>
              <Folder size={48} color="#FFB020" fill="#FFCF70" />
            </FolderIconWrapper>
            <FolderInfo>
              <FolderName>{folder.name}</FolderName>
              <FolderCount>{folder.count} files</FolderCount>
            </FolderInfo>
          </FolderCard>
        ))}
      </FolderGrid>
    );
  };


  // =====================================================
  // RENDER ACTIVE FOLDER
  // =====================================================
  const renderActiveFolder = () => {
    const urls = getUrls(activeFolder);
    const folderName = activeFolder === 'rc_book' ? 'RC Book' : activeFolder === 'insurance' ? 'Insurance' : 'Pollution Certificate';

    return (
      <ActiveFolderContainer>
        <Breadcrumb>
          <BreadcrumbLink onClick={() => setActiveFolder(null)}>Documents</BreadcrumbLink>
          <ChevronRight size={16} color="#94A3B8" />
          <BreadcrumbCurrent>{folderName}</BreadcrumbCurrent>
        </Breadcrumb>

        <FolderHeader>
          <FolderTitle>{folderName}</FolderTitle>
          {canEdit && (
            <UploadButton onClick={() => fileInputRef.current?.click()} disabled={uploading}>
              <UploadCloud size={20} />
              {uploading ? "Uploading..." : "Add Photos"}
            </UploadButton>
          )}
          <input
            type="file"
            multiple
            accept="image/*"
            style={{ display: "none" }}
            ref={fileInputRef}
            onChange={handleFileUpload}
          />
        </FolderHeader>

        {urls.length === 0 ? (
          <EmptyState>
            <Folder size={64} color="#E2E8F0" />
            <EmptyTitle>No photos yet</EmptyTitle>
            <EmptySubtitle>Upload documents to store them securely here.</EmptySubtitle>
          </EmptyState>
        ) : (
          <ImageGrid>
            {urls.map((url, idx) => (
              <ImageCard key={idx} onClick={() => setLightboxIndex(idx)}>
                <Thumbnail src={ensureHttps(url)} alt={`Document ${idx + 1}`} />
                {canEdit && (
                  <DeleteButton onClick={(e) => handleDelete(url, e)} disabled={uploading}>
                    <Trash2 size={16} />
                  </DeleteButton>
                )}
              </ImageCard>
            ))}
          </ImageGrid>
        )}

        {/* LIGHTBOX */}
        {lightboxIndex !== -1 && (
          <LightboxOverlay onClick={() => setLightboxIndex(-1)}>
            <LightboxClose onClick={(e) => { e.stopPropagation(); setLightboxIndex(-1); }}>
              <X size={32} />
            </LightboxClose>
            <LightboxImage 
              src={ensureHttps(urls[lightboxIndex])} 
              onClick={(e) => e.stopPropagation()} 
            />
            {urls.length > 1 && (
              <>
                <LightboxPrev 
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => prev === 0 ? urls.length - 1 : prev - 1); }}
                >
                  <ChevronRight size={32} style={{ transform: 'rotate(180deg)' }} />
                </LightboxPrev>
                <LightboxNext 
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(prev => prev === urls.length - 1 ? 0 : prev + 1); }}
                >
                  <ChevronRight size={32} />
                </LightboxNext>
              </>
            )}
          </LightboxOverlay>
        )}
      </ActiveFolderContainer>
    );
  };

  if (loading) return <LoadingState>Loading documents...</LoadingState>;
  if (error) return <ErrorState>{error}</ErrorState>;
  if (!lorry) return <ErrorState>Lorry not found</ErrorState>;

  return (
    <PageContainer>
      <Header>
        <BackButton onClick={() => navigate(-1)}>
          <ArrowLeft size={24} />
        </BackButton>
        <HeaderTitle>Lorry Documents - {lorry.registration_number}</HeaderTitle>
      </Header>

      <Content>
        {activeFolder === null ? renderFolders() : renderActiveFolder()}
      </Content>
    </PageContainer>
  );
};

export default LorryDocumentsPage;

// =====================================================
// STYLED COMPONENTS
// =====================================================

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const PageContainer = styled.div`
  min-height: 100vh;
  background-color: #F8FAFC;
  font-family: 'Inter', sans-serif;
`;

const Header = styled.div`
  background: white;
  padding: 1.5rem 2rem;
  display: flex;
  align-items: center;
  gap: 1.5rem;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  position: sticky;
  top: 0;
  z-index: 10;
`;

const BackButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.5rem;
  border-radius: 50%;
  color: #475569;
  transition: all 0.2s;

  &:hover {
    background-color: #F1F5F9;
    color: #0F172A;
  }
`;

const HeaderTitle = styled.h1`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #0F172A;
`;

const Content = styled.div`
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  animation: ${fadeIn} 0.4s ease-out;
`;

// FOLDERS VIEW
const FolderGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 1.5rem;
`;

const FolderCard = styled.div`
  background: white;
  border-radius: 1rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05), 0 2px 4px -2px rgba(0,0,0,0.02);
  border: 1px solid #E2E8F0;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 10px 15px -3px rgba(0,0,0,0.1), 0 4px 6px -4px rgba(0,0,0,0.05);
    border-color: #CBD5E1;
  }
`;

const FolderIconWrapper = styled.div`
  margin-bottom: 0.5rem;
`;

const FolderInfo = styled.div`
  text-align: center;
`;

const FolderName = styled.h3`
  margin: 0 0 0.25rem 0;
  font-size: 1.125rem;
  font-weight: 600;
  color: #1E293B;
`;

const FolderCount = styled.p`
  margin: 0;
  font-size: 0.875rem;
  color: #64748B;
`;

// ACTIVE FOLDER VIEW
const ActiveFolderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
`;

const Breadcrumb = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
`;

const BreadcrumbLink = styled.button`
  background: none;
  border: none;
  padding: 0;
  color: #64748B;
  cursor: pointer;
  font-weight: 500;
  
  &:hover {
    color: #0F172A;
    text-decoration: underline;
  }
`;

const BreadcrumbCurrent = styled.span`
  color: #0F172A;
  font-weight: 600;
`;

const FolderHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const FolderTitle = styled.h2`
  margin: 0;
  font-size: 1.5rem;
  font-weight: 700;
  color: #1E293B;
`;

const UploadButton = styled.button`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  background-color: #2563EB;
  color: white;
  border: none;
  padding: 0.75rem 1.25rem;
  border-radius: 0.5rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;

  &:hover:not(:disabled) {
    background-color: #1D4ED8;
  }

  &:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  background: white;
  border-radius: 1rem;
  border: 1px dashed #CBD5E1;
`;

const EmptyTitle = styled.h3`
  margin: 1rem 0 0.5rem 0;
  color: #334155;
  font-size: 1.125rem;
`;

const EmptySubtitle = styled.p`
  margin: 0;
  color: #64748B;
  font-size: 0.875rem;
`;

const ImageGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 1.5rem;
`;

const ImageCard = styled.div`
  position: relative;
  aspect-ratio: 1;
  border-radius: 0.75rem;
  overflow: hidden;
  cursor: pointer;
  box-shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  group: hover;
  
  &::after {
    content: '';
    position: absolute;
    inset: 0;
    background: rgba(0,0,0,0);
    transition: background 0.2s;
  }

  &:hover::after {
    background: rgba(0,0,0,0.1);
  }
`;

const Thumbnail = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
  
  ${ImageCard}:hover & {
    transform: scale(1.05);
  }
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  z-index: 2;
  background: rgba(239, 68, 68, 0.9);
  color: white;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transform: scale(0.9);
  transition: all 0.2s;

  ${ImageCard}:hover & {
    opacity: 1;
    transform: scale(1);
  }

  &:hover {
    background: #DC2626;
    transform: scale(1.1) !important;
  }
`;

// LIGHTBOX
const LightboxOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const LightboxImage = styled.img`
  max-width: 90%;
  max-height: 90vh;
  object-fit: contain;
`;

const LightboxClose = styled.button`
  position: absolute;
  top: 2rem;
  right: 2rem;
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  border-radius: 50%;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const LightboxBtn = styled.button`
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  border: none;
  border-radius: 50%;
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background 0.2s;

  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
`;

const LightboxPrev = styled(LightboxBtn)`
  left: 2rem;
`;

const LightboxNext = styled(LightboxBtn)`
  right: 2rem;
`;

// STATES
const LoadingState = styled.div`
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  color: #64748B;
`;

const ErrorState = styled(LoadingState)`
  color: #EF4444;
`;
