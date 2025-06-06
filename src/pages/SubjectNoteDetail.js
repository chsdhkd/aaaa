// src/pages/SubjectNoteDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { db } from '../firebase';
import { collection, query, where, getDocs, addDoc, serverTimestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import './SubjectNoteDetail.css';
import { useNavigate } from 'react-router-dom';






const subjectNameMap = {
  math: '수학',
  physics: '물리',
  chemical: '화학',
  biology: '생명',
  earth: '지구'
};



const SubjectNoteDetail = () => {

  const [editMode, setEditMode] = useState(false);
  const [editTitle, setEditTitle] = useState('');
  const [editContent, setEditContent] = useState('');
  const [editImage, setEditImage] = useState('');

  const { subject } = useParams();
  const subjectName = subjectNameMap[subject] || '기타';

  const [notes, setNotes] = useState([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [newImage, setNewImage] = useState('');
  const [selectedNote, setSelectedNote] = useState(null);


  const fetchNotes = async () => {
    const q = query(collection(db, 'notes'), where('subject', '==', subjectName));
    const snapshot = await getDocs(q);
    const data = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    setNotes(data);
  };

  useEffect(() => {
   
    fetchNotes();
  }, [subjectName]);


  const handleAddNote = async () => {
    if (!newTitle.trim() || !newContent.trim()) return;
    const note = {
      subject: subjectName,
      title: newTitle,
      content: newContent,
      image: newImage,
      createdAt: serverTimestamp()
    };
    const docRef = await addDoc(collection(db, 'notes'), note);
    await fetchNotes();
    setNewTitle('');
    setNewContent('');
    setNewImage('');
  };

  const navigate = useNavigate();

  
  
  const startEdit = () => {
    setEditTitle(selectedNote.title);
    setEditContent(selectedNote.content);
    setEditImage(selectedNote.image || '');
    setEditMode(true);
  };

  const handleUpdateNote = async () => {
    const noteRef = doc(db, 'notes', selectedNote.id);
    await updateDoc(noteRef, {
      title: editTitle,
      content: editContent,
      image: editImage,
    });
    await fetchNotes();
    setSelectedNote(null);
    setEditMode(false);
  };

  const handleDeleteNote = async () => {
    if (!window.confirm('정말 삭제하시겠습니까?')) return;
    const noteRef = doc(db, 'notes', selectedNote.id);
    await deleteDoc(noteRef);
    await fetchNotes();
    setSelectedNote(null);
  };

  

  return (

 

    <div className="note-detail-container">
  <h2>{subjectName} 노트</h2>
   <button className="back-button" onClick={() => navigate('/notes')}>← 과목 선택으로 돌아가기</button>


  <div className="note-form-card">
    <h3>새 노트 추가</h3>
    <input
      type="text"
      placeholder="제목 입력"
      value={newTitle}
      onChange={(e) => setNewTitle(e.target.value)}
    />
    <textarea
      placeholder="내용 입력"
      value={newContent}
      onChange={(e) => setNewContent(e.target.value)}
      rows={4}
    />
    <input
      type="text"
      placeholder="이미지 URL (선택)"
      value={newImage}
      onChange={(e) => setNewImage(e.target.value)}
    />
    <button onClick={handleAddNote}>노트 추가</button>
  </div>

  <ul className="note-list">
    {notes.map((note) => (
      <li
        key={note.id}
        onClick={() => setSelectedNote(note)}
        className="note-item"
      >
        {note.title} | {note.createdAt ? new Date(note.createdAt.toDate()).toLocaleDateString() : '날짜 없음'}
      </li>
    ))}
  </ul>



  {selectedNote && (
    <div className="note-header">
      <strong>{selectedNote.title}</strong> |{' '}
      {selectedNote.createdAt ? new Date(selectedNote.createdAt.toDate()).toLocaleDateString() : '날짜 없음'}
      <hr />
    </div>
  )}


{selectedNote && (
  <div className="note-preview">
    {!editMode ? (
      <>
        <h3>{selectedNote.title}</h3>
        <p>{selectedNote.content}</p>
        {selectedNote.image && <img src={selectedNote.image} alt="노트 이미지" />}
        <div style={{ marginTop: '16px', display: 'flex', gap: '8px' }}>
          <button onClick={startEdit}>수정</button>
          <button onClick={handleDeleteNote}>삭제</button>
          <button onClick={() => setSelectedNote(null)}>닫기</button>
        </div>
      </>
    ) : (
      <>
        <input
          type="text"
          value={editTitle}
          onChange={(e) => setEditTitle(e.target.value)}
          className="edit-input"
        />
        <textarea
          value={editContent}
          onChange={(e) => setEditContent(e.target.value)}
          rows={4}
          className="edit-textarea"
        />
        <input
          type="text"
          value={editImage}
          onChange={(e) => setEditImage(e.target.value)}
          className="edit-input"
        />
        <div className='edit-button-group'>
          <button className='edit-button-save' onClick={handleUpdateNote}>저장</button>
          <button className='edit-button-cancel' onClick={() => setEditMode(false)}>취소</button>
        </div>
      </>
    )}
  </div>
)}

  
</div>

  );
};

export default SubjectNoteDetail;
